/**
 * ==============================================================================
 * MEMORYMASTER - GERENCIADOR DE SALAS MULTIPLAYER AO VIVO (ROOM MANAGER)
 * ==============================================================================
 * Inspirado na arquitetura de salas síncronas do QuizMaster:
 * 1. Criação de salas com PIN de 6 dígitos (Host-Controlled)
 * 2. Entrada de alunos/jogadores com nickname e avatar
 * 3. Sincronização em tempo real (Dual-Mode: Cloud Firestore + BroadcastChannel local)
 * 4. Início de jogo sincronizado com seed idêntica de embaralhamento
 * 5. Pódio coletivo e ranking ao vivo da turma
 */

import { db, isFirebaseConfigured } from './firebaseConfig.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

class RoomManager {
  constructor() {
    this.currentRoom = null;
    this.isHost = false;
    this.unsubscribeFirestore = null;
    this.roomListeners = [];

    // BroadcastChannel para sincronização instantânea local (multi-abas ou testes offline)
    this.channel = typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel('memorymaster_room_channel')
      : null;

    if (this.channel) {
      this.channel.onmessage = (event) => this.handleBroadcastMessage(event.data);
    }

    // Escuta eventos de storage para sincronização entre abas
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('memorymaster_room_') && this.currentRoom) {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && updated.pin === this.currentRoom.pin) {
            this.updateLocalRoom(updated);
          }
        } catch (err) {}
      }
    });
  }

  generatePin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Cria uma nova sala como Host
   */
  async createRoom(hostUser, deck, difficulty = 'medium', mode = 'timed') {
    const pin = this.generatePin();
    const seed = Math.floor(Math.random() * 1000000);

    const roomData = {
      pin,
      hostId: hostUser.uid,
      hostName: hostUser.displayName,
      deckId: deck.id,
      deckTitle: deck.title,
      deckData: {
        id: deck.id,
        title: deck.title,
        pairs: deck.pairs
      },
      difficulty,
      mode,
      status: 'waiting', // 'waiting' | 'active' | 'finished'
      seed,
      players: [
        {
          uid: hostUser.uid,
          displayName: hostUser.displayName,
          avatarEmoji: hostUser.avatarEmoji || '👑',
          photoURL: hostUser.photoURL || null,
          isHost: true,
          score: 0,
          moves: 0,
          finished: false,
          timeSeconds: 0
        }
      ],
      createdAt: new Date().toISOString()
    };

    this.currentRoom = roomData;
    this.isHost = true;

    // Salva localmente
    this.saveLocalRoom(roomData);

    // Se Firebase estiver configurado, salva no Firestore
    if (db && isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'rooms', pin), roomData);
      } catch (err) {
        console.warn('Falha ao sincronizar sala no Firestore, mantendo modo local:', err);
      }
    }

    this.subscribeToRoom(pin);
    this.broadcast({ type: 'ROOM_CREATED', room: roomData });

    return roomData;
  }

  /**
   * Entra em uma sala existente através do PIN
   */
  async joinRoom(pin, user) {
    const cleanPin = pin.trim();
    let room = await this.fetchRoom(cleanPin);

    if (!room) {
      throw new Error(`Sala com PIN "${cleanPin}" não encontrada. Verifique o código digitado.`);
    }

    if (room.status !== 'waiting') {
      throw new Error('Esta partida já foi iniciada ou encerrada pelo anfitrião.');
    }

    // Adiciona o jogador se já não estiver na lista
    const existingIndex = room.players.findIndex(p => p.uid === user.uid);
    const playerData = {
      uid: user.uid,
      displayName: user.displayName,
      avatarEmoji: user.avatarEmoji || '🎓',
      photoURL: user.photoURL || null,
      isHost: room.hostId === user.uid,
      score: 0,
      moves: 0,
      finished: false,
      timeSeconds: 0
    };

    if (existingIndex >= 0) {
      room.players[existingIndex] = playerData;
    } else {
      room.players.push(playerData);
    }

    this.currentRoom = room;
    this.isHost = (room.hostId === user.uid);

    // Persiste atualização
    await this.persistRoomUpdate(room);

    this.subscribeToRoom(cleanPin);
    this.broadcast({ type: 'ROOM_UPDATED', room });

    return room;
  }

  /**
   * Busca dados da sala (Firestore com fallback para LocalStorage)
   */
  async fetchRoom(pin) {
    if (db && isFirebaseConfigured()) {
      try {
        const snap = await getDoc(doc(db, 'rooms', pin));
        if (snap.exists()) {
          return snap.data();
        }
      } catch (err) {
        console.warn('Erro ao consultar Firestore, tentando LocalStorage:', err);
      }
    }

    // Fallback Local
    return this.loadLocalRoom(pin);
  }

  /**
   * Inicia a partida para todos os jogadores (Ação do Host)
   */
  async startRoomGame(pin) {
    if (!this.currentRoom || !this.isHost) return;

    this.currentRoom.status = 'active';
    this.currentRoom.startedAt = new Date().toISOString();

    await this.persistRoomUpdate(this.currentRoom);
    this.broadcast({ type: 'GAME_STARTED', room: this.currentRoom });
  }

  /**
   * Atualiza a pontuação do jogador na sala
   */
  async updatePlayerScore(pin, uid, stats) {
    if (!this.currentRoom) return;

    const player = this.currentRoom.players.find(p => p.uid === uid);
    if (player) {
      player.score = stats.score || 0;
      player.moves = stats.moves || 0;
      player.timeSeconds = stats.timeSeconds || 0;
      player.finished = !!stats.finished;

      // Se todos os jogadores terminaram, marca como encerrado
      const allFinished = this.currentRoom.players.every(p => p.finished);
      if (allFinished) {
        this.currentRoom.status = 'finished';
      }

      await this.persistRoomUpdate(this.currentRoom);
      this.broadcast({ type: 'PLAYER_SCORED', room: this.currentRoom });
    }
  }

  /**
   * Expulsa um jogador da sala (Ação do Host)
   */
  async kickPlayer(pin, uid) {
    if (!this.currentRoom || !this.isHost) return;
    this.currentRoom.players = this.currentRoom.players.filter(p => p.uid !== uid);
    await this.persistRoomUpdate(this.currentRoom);
    this.broadcast({ type: 'PLAYER_KICKED', kickedUid: uid, room: this.currentRoom });
  }

  /**
   * Inscreve ouvinte em tempo real para atualizações da sala
   */
  subscribeToRoom(pin) {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }

    if (db && isFirebaseConfigured()) {
      try {
        this.unsubscribeFirestore = onSnapshot(doc(db, 'rooms', pin), (docSnap) => {
          if (docSnap.exists()) {
            this.updateLocalRoom(docSnap.data());
          }
        });
      } catch (err) {
        console.warn('Não foi possível assinar snapshot do Firestore:', err);
      }
    }
  }

  updateLocalRoom(roomData) {
    this.currentRoom = roomData;
    this.saveLocalRoom(roomData);
    this.notifyRoomListeners(roomData);
  }

  async persistRoomUpdate(roomData) {
    this.saveLocalRoom(roomData);

    if (db && isFirebaseConfigured()) {
      try {
        await updateDoc(doc(db, 'rooms', roomData.pin), roomData);
      } catch (err) {
        console.warn('Erro ao atualizar documento no Firestore:', err);
      }
    }
  }

  saveLocalRoom(roomData) {
    localStorage.setItem(`memorymaster_room_${roomData.pin}`, JSON.stringify(roomData));
  }

  loadLocalRoom(pin) {
    try {
      const data = localStorage.getItem(`memorymaster_room_${pin}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  leaveCurrentRoom() {
    if (this.unsubscribeFirestore) {
      this.unsubscribeFirestore();
      this.unsubscribeFirestore = null;
    }
    this.currentRoom = null;
    this.isHost = false;
  }

  onRoomUpdated(callback) {
    this.roomListeners.push(callback);
    if (this.currentRoom) callback(this.currentRoom);
  }

  notifyRoomListeners(room) {
    this.roomListeners.forEach(cb => cb(room));
  }

  broadcast(message) {
    if (this.channel) {
      this.channel.postMessage(message);
    }
  }

  handleBroadcastMessage(data) {
    if (data && data.room && this.currentRoom && data.room.pin === this.currentRoom.pin) {
      this.updateLocalRoom(data.room);
    }
  }
}

export const roomManager = new RoomManager();

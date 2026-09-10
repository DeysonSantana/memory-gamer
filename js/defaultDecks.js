/**
 * ==============================================================================
 * MEMORYMASTER - BARALHOS EDUCATIVOS PADRÃO (MULTIDISCIPLINAR)
 * ==============================================================================
 * Cada baralho é composto por pares de cartas educativas.
 * Suporta:
 * 1. Pares Conceituais (Termo A <-> Termo B / Definição)
 * 2. Pares Visuais (Ícone <-> Nome)
 * 3. Pílula pedagógica (curiosity) exibida ao encontrar o par!
 */

export const DEFAULT_DECKS = [
  // --- 1. TECNOLOGIA & PROGRAMAÇÃO ---
  {
    id: 'tech',
    title: 'Tecnologia & Desenvolvimento',
    category: 'Computação',
    icon: 'fa-laptop-code',
    description: 'Linguagens, frameworks e ferramentas essenciais da engenharia de software.',
    pairs: [
      {
        id: 'javascript',
        cardA: { content: 'JavaScript', icon: 'devicon-javascript-plain colored', isIcon: true },
        cardB: { content: 'Linguagem da Web', subtext: 'Executa nativamente nos navegadores' },
        curiosity: 'JavaScript foi criado em apenas 10 dias por Brendan Eich em maio de 1995 na Netscape!'
      },
      {
        id: 'python',
        cardA: { content: 'Python', icon: 'devicon-python-plain colored', isIcon: true },
        cardB: { content: 'IA e Data Science', subtext: 'Sintaxe limpa e tipagem dinâmica' },
        curiosity: 'O nome Python não veio da cobra, mas do programa de comédia britânico Monty Python!'
      },
      {
        id: 'react',
        cardA: { content: 'React', icon: 'devicon-react-original colored', isIcon: true },
        cardB: { content: 'Virtual DOM & UI', subtext: 'Biblioteca declarativa para interfaces' },
        curiosity: 'O React foi criado pelo Facebook e introduziu o revolucionário conceito de Virtual DOM.'
      },
      {
        id: 'docker',
        cardA: { content: 'Docker', icon: 'devicon-docker-plain colored', isIcon: true },
        cardB: { content: 'Containers', subtext: 'Isolamento leve de aplicações' },
        curiosity: 'Containers compartilham o mesmo kernel do SO hospedeiro, sendo muito mais leves que VMs.'
      },
      {
        id: 'git',
        cardA: { content: 'Git', icon: 'devicon-git-plain colored', isIcon: true },
        cardB: { content: 'Controle de Versão', subtext: 'Histórico distribuído de commits' },
        curiosity: 'O Git foi criado por Linus Torvalds em 2005 para gerenciar o código do kernel Linux.'
      },
      {
        id: 'nodejs',
        cardA: { content: 'Node.js', icon: 'devicon-nodejs-plain colored', isIcon: true },
        cardB: { content: 'JS no Servidor', subtext: 'Event-loop assíncrono com V8' },
        curiosity: 'Ryan Dahl criou o Node.js utilizando a engine V8 do Google Chrome para backend escalável.'
      },
      {
        id: 'linux',
        cardA: { content: 'Linux', icon: 'devicon-linux-plain', isIcon: true },
        cardB: { content: 'Kernel Open-Source', subtext: 'Base da maioria dos servidores e nuvens' },
        curiosity: 'Mais de 90% dos maiores supercomputadores e servidores em nuvem do planeta rodam Linux.'
      },
      {
        id: 'aws',
        cardA: { content: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored', isIcon: true },
        cardB: { content: 'Cloud Computing', subtext: 'Infraestrutura elástica sob demanda' },
        curiosity: 'A AWS foi pioneira no modelo de nuvem pública comercial moderna desde seu lançamento em 2006.'
      },
      {
        id: 'sql',
        cardA: { content: 'SQL', icon: 'fa-solid fa-database', isIcon: true },
        cardB: { content: 'Bancos Relacionais', subtext: 'Structured Query Language (Tabelas)' },
        curiosity: 'A linguagem SQL foi criada na IBM nos anos 70 baseada no modelo relacional de Edgar F. Codd.'
      },
      {
        id: 'typescript',
        cardA: { content: 'TypeScript', icon: 'devicon-typescript-plain colored', isIcon: true },
        cardB: { content: 'Tipagem Estática', subtext: 'Superset do JavaScript mantido pela Microsoft' },
        curiosity: 'TypeScript foi projetado por Anders Hejlsberg, o mesmo arquiteto das linguagens C# e Turbo Pascal.'
      },
      {
        id: 'api',
        cardA: { content: 'API REST', icon: 'fa-solid fa-network-wired', isIcon: true },
        cardB: { content: 'Comunicação HTTP', subtext: 'Integração client-server via JSON' },
        curiosity: 'O conceito REST foi formalizado por Roy Fielding em sua tese de doutorado no ano 2000.'
      },
      {
        id: 'security',
        cardA: { content: 'Criptografia', icon: 'fa-solid fa-shield-halved', isIcon: true },
        cardB: { content: 'Segurança & HTTPS', subtext: 'Proteção ponta a ponta dos dados' },
        curiosity: 'O protocolo HTTPS utiliza algoritmos criptográficos como TLS para proteger o tráfego contra espionagem.'
      }
    ]
  },

  // --- 2. BIOLOGIA & CIÊNCIAS DA NATUREZA ---
  {
    id: 'biology',
    title: 'Biologia Celular & Humana',
    category: 'Ciências',
    icon: 'fa-dna',
    description: 'Organelas celulares, genética e fisiologia humana com pares conceituais.',
    pairs: [
      {
        id: 'mitochondria',
        cardA: { content: 'Mitocôndria', subtext: 'A usina da célula' },
        cardB: { content: 'Respiração Celular', subtext: 'Produção de ATP' },
        curiosity: 'As mitocôndrias possuem seu próprio DNA circular, herdado quase que exclusivamente da mãe!'
      },
      {
        id: 'chloroplast',
        cardA: { content: 'Cloroplasto', subtext: 'Pigmento verde' },
        cardB: { content: 'Fotossíntese', subtext: 'Conversão de luz em glicose' },
        curiosity: 'Os cloroplastos captam fótons solares para quebrar moléculas de água e liberar oxigênio.'
      },
      {
        id: 'dna',
        cardA: { content: 'DNA', subtext: 'Ácido Desoxirribonucleico' },
        cardB: { content: 'Código Genético', subtext: 'Dupla hélice hereditária' },
        curiosity: 'Se esticássemos todo o DNA de uma única célula humana, ele mediria cerca de 2 metros de comprimento!'
      },
      {
        id: 'hemoglobin',
        cardA: { content: 'Hemoglobina', subtext: 'Proteína nos glóbulos vermelhos' },
        cardB: { content: 'Transporte de O₂', subtext: 'Leva oxigênio aos tecidos' },
        curiosity: 'A hemoglobina contém átomos de ferro no grupo heme, conferindo a cor avermelhada ao sangue.'
      },
      {
        id: 'neuron',
        cardA: { content: 'Neurônio', subtext: 'Célula nervosa especializada' },
        cardB: { content: 'Sinapses Elétricas', subtext: 'Transmissão de neurotransmissores' },
        curiosity: 'O cérebro humano possui cerca de 86 bilhões de neurônios capazes de fazer trilhões de conexões.'
      },
      {
        id: 'ribosome',
        cardA: { content: 'Ribossomo', subtext: 'Complexo molecular' },
        cardB: { content: 'Síntese de Proteínas', subtext: 'Tradução do RNA mensageiro' },
        curiosity: 'Os ribossomos leem o código do RNAm trinca por trinca (códon) para unir os aminoácidos.'
      },
      {
        id: 'insulin',
        cardA: { content: 'Insulina', subtext: 'Hormônio do Pâncreas' },
        cardB: { content: 'Controle da Glicose', subtext: 'Entrada de açúcar nas células' },
        curiosity: 'A insulina foi descoberta em 1921 por Banting e Best, salvando milhões de vidas com diabetes.'
      },
      {
        id: 'antibody',
        cardA: { content: 'Anticorpo', subtext: 'Imunoglobulina de defesa' },
        cardB: { content: 'Sistema Imunológico', subtext: 'Neutralização de antígenos' },
        curiosity: 'Anticorpos são como chaves específicas criadas pelos linfócitos B para neutralizar patógenos.'
      },
      {
        id: 'vacuole',
        cardA: { content: 'Vacúolo Vegetal', subtext: 'Grande bolsa membranosa' },
        cardB: { content: 'Reserva de Água', subtext: 'Regulação osmótica vegetal' },
        curiosity: 'Nas plantas adultas, o vacúolo central pode ocupar até 90% de todo o volume da célula vegetal!'
      },
      {
        id: 'enzyme',
        cardA: { content: 'Enzima', subtext: 'Catalisador biológico' },
        cardB: { content: 'Acelera Reações', subtext: 'Diminui a energia de ativação' },
        curiosity: 'Enzimas aumentam a velocidade das reações vitais em milhões de vezes sem serem consumidas.'
      },
      {
        id: 'platelet',
        cardA: { content: 'Plaquetas', subtext: 'Fragmentos de megacariócitos' },
        cardB: { content: 'Coagulação Sanguínea', subtext: 'Estancamento de hemorragias' },
        curiosity: 'As plaquetas não são células inteiras, mas fragmentos celulares essenciais para estancar sangramentos.'
      },
      {
        id: 'osmosis',
        cardA: { content: 'Osmose', subtext: 'Transporte passivo' },
        cardB: { content: 'Movimento da Água', subtext: 'Do meio hipotônico ao hipertônico' },
        curiosity: 'A osmose não consome energia (ATP) celular, buscando sempre o equilíbrio de concentrações.'
      }
    ]
  },

  // --- 3. QUÍMICA GERAL ---
  {
    id: 'chemistry',
    title: 'Química & Fórmulas',
    category: 'Ciências Exatas',
    icon: 'fa-flask-vial',
    description: 'Elementos químicos, fórmulas moleculares e reações fundamentais.',
    pairs: [
      {
        id: 'water',
        cardA: { content: 'H₂O', subtext: 'Fórmula molecular' },
        cardB: { content: 'Água', subtext: 'Solvente universal da vida' },
        curiosity: 'A água possui pontes de hidrogênio responsáveis pelo seu alto calor específico e tensão superficial.'
      },
      {
        id: 'salt',
        cardA: { content: 'NaCl', subtext: 'Ligação iônica' },
        cardB: { content: 'Sal de Cozinha', subtext: 'Cloreto de Sódio' },
        curiosity: 'Composto por Sódio (metal explosivo com água) e Cloro (gás tóxico), que juntos formam o sal vital.'
      },
      {
        id: 'co2',
        cardA: { content: 'CO₂', subtext: 'Geometria linear' },
        cardB: { content: 'Dióxido de Carbono', subtext: 'Gás do efeito estufa' },
        curiosity: 'O dióxido de carbono sublima a -78,5 °C diretamente do estado sólido para gás (Gelo Seco).'
      },
      {
        id: 'glucose',
        cardA: { content: 'C₆H₁₂O₆', subtext: 'Monossacarídeo vital' },
        cardB: { content: 'Glicose', subtext: 'Combustível da respiração' },
        curiosity: 'A glicose é o carboidrato primordial usado pelo cérebro para gerar energia rápida via ATP.'
      },
      {
        id: 'iron',
        cardA: { content: 'Fe', subtext: 'Número Atômico 26' },
        cardB: { content: 'Ferro', subtext: 'Metal de transição maleável' },
        curiosity: 'O ferro é o elemento final produzido por fusão no núcleo de estrelas gigantes antes de supernovas.'
      },
      {
        id: 'gold',
        cardA: { content: 'Au', subtext: 'Do latim Aurum' },
        cardB: { content: 'Ouro', subtext: 'Metal nobre resistente à corrosão' },
        curiosity: 'Quase todo o ouro da Terra foi originado em colisões de estrelas de nêutrons no cosmos.'
      },
      {
        id: 'methane',
        cardA: { content: 'CH₄', subtext: 'Hidrocarboneto mais simples' },
        cardB: { content: 'Gás Metano', subtext: 'Principal gás natural' },
        curiosity: 'O metano é um potente gás de efeito estufa, retendo mais de 25 vezes mais calor que o CO₂.'
      },
      {
        id: 'ph',
        cardA: { content: 'pH < 7', subtext: 'Escala logarítmica' },
        cardB: { content: 'Solução Ácida', subtext: 'Alta concentração de H⁺' },
        curiosity: 'A escala de pH mede o potencial hidrogeniônico. O suco gástrico tem pH em torno de 1,5 a 2!'
      },
      {
        id: 'helium',
        cardA: { content: 'He', subtext: 'Gás Nobre inerte' },
        cardB: { content: 'Hélio', subtext: '2º elemento mais abundante' },
        curiosity: 'O gás hélio foi descoberto primeiro no Sol (através de espectrometria) antes de ser achado na Terra.'
      },
      {
        id: 'ethanol',
        cardA: { content: 'C₂H₅OH', subtext: 'Função álcool' },
        cardB: { content: 'Etanol', subtext: 'Biocombustível renovável' },
        curiosity: 'No Brasil, o etanol de cana-de-açúcar é um dos biocombustíveis com menor pegada de carbono do mundo.'
      },
      {
        id: 'ozone',
        cardA: { content: 'O₃', subtext: 'Alótropo do oxigênio' },
        cardB: { content: 'Ozônio', subtext: 'Filtro de radiação UV' },
        curiosity: 'A camada de ozônio na estratosfera filtra até 99% dos raios ultravioleta nocivos do Sol.'
      },
      {
        id: 'ammonia',
        cardA: { content: 'NH₃', subtext: 'Gás alcalino picante' },
        cardB: { content: 'Amônia', subtext: 'Base para fertilizantes' },
        curiosity: 'O processo Haber-Bosch de sintetizar amônia do ar permitiu a produção maciça de alimentos no século XX.'
      }
    ]
  },

  // --- 4. GEOGRAFIA & PAÍSES ---
  {
    id: 'geography',
    title: 'Geografia & Capitais',
    category: 'Humanas',
    icon: 'fa-earth-americas',
    description: 'Reconheça países, capitais do mundo e monumentos marcantes.',
    pairs: [
      {
        id: 'brazil',
        cardA: { content: '🇧🇷 Brasil', subtext: 'América do Sul' },
        cardB: { content: 'Brasília', subtext: 'Capital planejada por Niemeyer' },
        curiosity: 'Inaugurada em 1960, Brasília tem o formato inspirado em um avião desenhado por Lúcio Costa.'
      },
      {
        id: 'japan',
        cardA: { content: '🇯🇵 Japão', subtext: 'Ásia Oriental' },
        cardB: { content: 'Tóquio', subtext: 'Maior metrópole do mundo' },
        curiosity: 'A Grande Tóquio abriga mais de 37 milhões de habitantes em sua região metropolitana integrada.'
      },
      {
        id: 'france',
        cardA: { content: '🇫🇷 França', subtext: 'Europa Ocidental' },
        cardB: { content: 'Paris', subtext: 'A Cidade Luz' },
        curiosity: 'A Torre Eiffel foi construída em 1889 como instalação temporária para a Feira Mundial!'
      },
      {
        id: 'australia',
        cardA: { content: '🇦🇺 Austrália', subtext: 'Oceania' },
        cardB: { content: 'Canberra', subtext: 'Capital federal australiana' },
        curiosity: 'Canberra foi escolhida como capital para resolver a rivalidade histórica entre Sydney e Melbourne!'
      },
      {
        id: 'canada',
        cardA: { content: '🇨🇦 Canadá', subtext: 'América do Norte' },
        cardB: { content: 'Ottawa', subtext: 'Capital no estado de Ontário' },
        curiosity: 'O Canadá possui a maior costa litorânea do planeta, ultrapassando 202.000 quilômetros.'
      },
      {
        id: 'egypt',
        cardA: { content: '🇪🇬 Egito', subtext: 'Norte da África' },
        cardB: { content: 'Cairo', subtext: 'Às margens do Rio Nilo' },
        curiosity: 'A Pirâmide de Gizé foi a construção mais alta feita pelo ser humano por mais de 3.800 anos.'
      },
      {
        id: 'germany',
        cardA: { content: '🇩🇪 Alemanha', subtext: 'Europa Central' },
        cardB: { content: 'Berlim', subtext: 'Capital multicultural' },
        curiosity: 'Berlim possui mais pontes navegáveis (mais de 1.700) do que a cidade de Veneza, na Itália!'
      },
      {
        id: 'argentina',
        cardA: { content: '🇦🇷 Argentina', subtext: 'Cone Sul' },
        cardB: { content: 'Buenos Aires', subtext: 'Capital e berço do Tango' },
        curiosity: 'A Avenida 9 de Julho em Buenos Aires é considerada uma das mais largas do mundo, com 140 metros.'
      },
      {
        id: 'italy',
        cardA: { content: '🇮🇹 Itália', subtext: 'Península Itálica' },
        cardB: { content: 'Roma', subtext: 'A Cidade Eterna' },
        curiosity: 'O menor país do mundo (o Vaticano) fica completamente encravado dentro da cidade de Roma.'
      },
      {
        id: 'india',
        cardA: { content: '🇮🇳 Índia', subtext: 'Sul da Ásia' },
        cardB: { content: 'Nova Délhi', subtext: 'Centro político da Índia' },
        curiosity: 'A Índia é atualmente o país mais populoso do mundo, ultrapassando 1,4 bilhão de pessoas.'
      },
      {
        id: 'south_africa',
        cardA: { content: '🇿🇦 África do Sul', subtext: 'Extremo sul africano' },
        cardB: { content: 'Pretória', subtext: 'Capital executiva do país' },
        curiosity: 'A África do Sul possui três capitais: Pretória (executiva), Cidade do Cabo (legislativa) e Bloemfontein (judiciária).'
      },
      {
        id: 'portugal',
        cardA: { content: '🇵🇹 Portugal', subtext: 'Península Ibérica' },
        cardB: { content: 'Lisboa', subtext: 'Capital às margens do Rio Tejo' },
        curiosity: 'Lisboa é uma das capitais mais antigas da Europa, superando cidades históricas como Londres e Roma em idade.'
      }
    ]
  },

  // --- 5. MATEMÁTICA & FÓRMULAS ---
  {
    id: 'math',
    title: 'Matemática & Teoremas',
    category: 'Exatas',
    icon: 'fa-calculator',
    description: 'Relações geométricas, teoremas célebres e constantes numéricas.',
    pairs: [
      {
        id: 'pythagoras',
        cardA: { content: 'Teorema de Pitágoras', subtext: 'Triângulos retângulos' },
        cardB: { content: 'a² + b² = c²', subtext: 'Soma dos quadrados dos catetos' },
        curiosity: 'Este teorema foi documentado pelos babilônios e egípcios séculos antes de Pitágoras formalizá-lo.'
      },
      {
        id: 'pi',
        cardA: { content: 'Constante Pi (π)', subtext: 'Razão do círculo' },
        cardB: { content: '3,14159...', subtext: 'Perímetro / Diâmetro' },
        curiosity: 'Pi é um número irracional e transcendental: suas casas decimais seguem infinitamente sem padrão repetitivo.'
      },
      {
        id: 'circle_area',
        cardA: { content: 'Área do Círculo', subtext: 'Geometria plana' },
        cardB: { content: 'A = π · r²', subtext: 'Pi vezes o raio ao quadrado' },
        curiosity: 'Arquimedes de Siracusa usou polígonos regulares inscritos e circunscritos para aproximar essa área.'
      },
      {
        id: 'bhaskara',
        cardA: { content: 'Equação de 2º Grau', subtext: 'ax² + bx + c = 0' },
        cardB: { content: 'Δ = b² - 4ac', subtext: 'Fórmula resolutiva (Bhaskara)' },
        curiosity: 'No Brasil chamamos de Fórmula de Bhaskara, mas na maioria dos países é chamada apenas de Quadratic Formula.'
      },
      {
        id: 'euler',
        cardA: { content: 'Número de Euler (e)', subtext: 'Base dos logaritmos naturais' },
        cardB: { content: '2,71828...', subtext: 'Juros compostos contínuos' },
        curiosity: 'O número e surge naturalmente no cálculo de crescimento populacional e decaimento radioativo contínuo.'
      },
      {
        id: 'fibonacci',
        cardA: { content: 'Sequência de Fibonacci', subtext: '0, 1, 1, 2, 3, 5, 8, 13...' },
        cardB: { content: 'Razão Áurea (φ)', subtext: 'Proporção áurea na natureza' },
        curiosity: 'A divisão entre números consecutivos de Fibonacci se aproxima de 1,618, presente em girassóis e caracóis.'
      },
      {
        id: 'triangle_angles',
        cardA: { content: 'Ângulos no Triângulo', subtext: 'Geometria euclidiana' },
        cardB: { content: 'Soma = 180°', subtext: 'Ângulos internos' },
        curiosity: 'Essa propriedade só vale na geometria plana euclidiana; numa esfera, a soma dos ângulos supera 180°!'
      },
      {
        id: 'speed_physics',
        cardA: { content: 'Velocidade Média', subtext: 'Cinemática básica' },
        cardB: { content: 'v = Δs / Δt', subtext: 'Variação de espaço pelo tempo' },
        curiosity: 'A velocidade da luz no vácuo (c) é o limite cósmico universal: cerca de 300.000 km por segundo.'
      },
      {
        id: 'newton_2nd',
        cardA: { content: '2ª Lei de Newton', subtext: 'Dinâmica de corpos' },
        cardB: { content: 'F = m · a', subtext: 'Força = Massa × Aceleração' },
        curiosity: 'Publicada no célebre Principia em 1687, é a base para o cálculo de órbitas, foguetes e mecânica clássica.'
      },
      {
        id: 'einstein',
        cardA: { content: 'Equivalência Massa-Energia', subtext: 'Relatividade Especial' },
        cardB: { content: 'E = m · c²', subtext: 'Energia = Massa × Luz²' },
        curiosity: 'Mostra que uma quantidade minúscula de matéria pode ser convertida em uma quantidade colossal de energia.'
      },
      {
        id: 'golden_ratio',
        cardA: { content: 'Número de Ouro (Phi)', subtext: 'Proporção divina' },
        cardB: { content: 'φ ≈ 1,618', subtext: '(1 + √5) / 2' },
        curiosity: 'Artistas como Leonardo da Vinci e arquitetos gregos usaram o retângulo áureo para alcançar harmonia estética.'
      },
      {
        id: 'logarithm',
        cardA: { content: 'Definição de Logaritmo', subtext: 'log_b(a) = x' },
        cardB: { content: 'b^x = a', subtext: 'Exponencial inversa' },
        curiosity: 'John Napier inventou os logaritmos no século XVII para simplificar cálculos manuais de astrônomos.'
      }
    ]
  },

  // --- 6. IDIOMAS & VOCABULÁRIO (INGLÊS) ---
  {
    id: 'languages',
    title: 'Idiomas & Vocabulário (Inglês)',
    category: 'Linguagens',
    icon: 'fa-language',
    description: 'Associe palavras-chave e expressões em inglês ao seu significado em português.',
    pairs: [
      {
        id: 'knowledge',
        cardA: { content: 'Knowledge', subtext: 'Inglês' },
        cardB: { content: 'Conhecimento', subtext: 'Português' },
        curiosity: '"Knowledge is power" (Conhecimento é poder) é uma famosa frase atribuída ao filósofo Francis Bacon.'
      },
      {
        id: 'challenge',
        cardA: { content: 'Challenge', subtext: 'Inglês' },
        cardB: { content: 'Desafio', subtext: 'Português' },
        curiosity: 'A palavra "challenge" vem do latim "calumnia", que originalmente significava acusação ou reivindicação.'
      },
      {
        id: 'breakthrough',
        cardA: { content: 'Breakthrough', subtext: 'Inglês' },
        cardB: { content: 'Avanço / Descoberta', subtext: 'Português' },
        curiosity: 'Usado para descrever saltos científicos fundamentais que rompem barreiras de conhecimento.'
      },
      {
        id: 'resilience',
        cardA: { content: 'Resilience', subtext: 'Inglês' },
        cardB: { content: 'Resiliência', subtext: 'Português' },
        curiosity: 'Originário da física para descrever materiais que voltam ao estado original após sofrerem pressão.'
      },
      {
        id: 'mindset',
        cardA: { content: 'Mindset', subtext: 'Inglês' },
        cardB: { content: 'Mentalidade / Postura', subtext: 'Português' },
        curiosity: 'Conceito popularizado pela psicóloga Carol Dweck ao diferenciar mentalidade fixa de mentalidade de crescimento.'
      },
      {
        id: 'skills',
        cardA: { content: 'Skills', subtext: 'Inglês' },
        cardB: { content: 'Habilidades / Aptidões', subtext: 'Português' },
        curiosity: 'No ambiente profissional moderno dividem-se em Hard Skills (técnicas) e Soft Skills (comportamentais).'
      },
      {
        id: 'feedback',
        cardA: { content: 'Feedback', subtext: 'Inglês' },
        cardB: { content: 'Retorno Formativo', subtext: 'Português' },
        curiosity: 'O termo foi cunhado na engenharia de sistemas para descrever circuitos que usam a saída para corrigir a entrada.'
      },
      {
        id: 'teamwork',
        cardA: { content: 'Teamwork', subtext: 'Inglês' },
        cardB: { content: 'Trabalho em Equipe', subtext: 'Português' },
        curiosity: 'Estudos mostram que times diversos e colaborativos resolvem problemas complexos mais rápido que indivíduos isolados.'
      },
      {
        id: 'growth',
        cardA: { content: 'Growth', subtext: 'Inglês' },
        cardB: { content: 'Crescimento', subtext: 'Português' },
        curiosity: 'Refere-se tanto à evolução biológica quanto ao amadurecimento intelectual ou expansão de projetos.'
      },
      {
        id: 'achievement',
        cardA: { content: 'Achievement', subtext: 'Inglês' },
        cardB: { content: 'Conquista / Sucesso', subtext: 'Português' },
        curiosity: 'Derivado do francês antigo "achever" (levar algo ao seu ápice ou conclusão satisfatória).'
      },
      {
        id: 'insight',
        cardA: { content: 'Insight', subtext: 'Inglês' },
        cardB: { content: 'Visão Clara / Percepção', subtext: 'Português' },
        curiosity: 'Significa "olhar para dentro" — o momento em que uma solução intuitiva se manifesta na mente.'
      },
      {
        id: 'leadership',
        cardA: { content: 'Leadership', subtext: 'Inglês' },
        cardB: { content: 'Liderança', subtext: 'Português' },
        curiosity: 'A boa liderança moderna é caracterizada por servir de apoio e inspirar a autonomia do grupo.'
      }
    ]
  }
];

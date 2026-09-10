/**
 * ==============================================================================
 * MEMORYMASTER - BARALHOS EDUCATIVOS COM ÍCONES VISUAIS (DUAL-CODING)
 * ==============================================================================
 * Cada carta possui tanto o conceito textual quanto um elemento visual (emoji/ícone)
 * para ativar a memória visual e a dupla codificação cognitiva (Palavra + Imagem).
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
        cardA: { content: 'JavaScript', icon: 'devicon-javascript-plain colored', isIcon: true, visual: '💻' },
        cardB: { content: 'Linguagem da Web', subtext: 'Executa nativamente nos navegadores', visual: '🌐' },
        curiosity: 'JavaScript foi criado em apenas 10 dias por Brendan Eich em maio de 1995 na Netscape!'
      },
      {
        id: 'python',
        cardA: { content: 'Python', icon: 'devicon-python-plain colored', isIcon: true, visual: '🐍' },
        cardB: { content: 'IA e Data Science', subtext: 'Sintaxe limpa e tipagem dinâmica', visual: '🤖' },
        curiosity: 'O nome Python não veio da cobra, mas do programa de comédia britânico Monty Python!'
      },
      {
        id: 'react',
        cardA: { content: 'React', icon: 'devicon-react-original colored', isIcon: true, visual: '⚛️' },
        cardB: { content: 'Virtual DOM & UI', subtext: 'Biblioteca declarativa para interfaces', visual: '📱' },
        curiosity: 'O React foi criado pelo Facebook e introduziu o revolucionário conceito de Virtual DOM.'
      },
      {
        id: 'docker',
        cardA: { content: 'Docker', icon: 'devicon-docker-plain colored', isIcon: true, visual: '🐳' },
        cardB: { content: 'Containers', subtext: 'Isolamento leve de aplicações', visual: '📦' },
        curiosity: 'Containers compartilham o mesmo kernel do SO hospedeiro, sendo muito mais leves que VMs.'
      },
      {
        id: 'git',
        cardA: { content: 'Git', icon: 'devicon-git-plain colored', isIcon: true, visual: '🌿' },
        cardB: { content: 'Controle de Versão', subtext: 'Histórico distribuído de commits', visual: '📜' },
        curiosity: 'O Git foi criado por Linus Torvalds em 2005 para gerenciar o código do kernel Linux.'
      },
      {
        id: 'nodejs',
        cardA: { content: 'Node.js', icon: 'devicon-nodejs-plain colored', isIcon: true, visual: '🟢' },
        cardB: { content: 'JS no Servidor', subtext: 'Event-loop assíncrono com V8', visual: '⚙️' },
        curiosity: 'Ryan Dahl criou o Node.js utilizando a engine V8 do Google Chrome para backend escalável.'
      },
      {
        id: 'linux',
        cardA: { content: 'Linux', icon: 'devicon-linux-plain', isIcon: true, visual: '🐧' },
        cardB: { content: 'Kernel Open-Source', subtext: 'Base da maioria dos servidores e nuvens', visual: '🖥️' },
        curiosity: 'Mais de 90% dos maiores supercomputadores e servidores em nuvem do planeta rodam Linux.'
      },
      {
        id: 'aws',
        cardA: { content: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored', isIcon: true, visual: '☁️' },
        cardB: { content: 'Cloud Computing', subtext: 'Infraestrutura elástica sob demanda', visual: '🚀' },
        curiosity: 'A AWS foi pioneira no modelo de nuvem pública comercial moderna desde seu lançamento em 2006.'
      },
      {
        id: 'sql',
        cardA: { content: 'SQL', icon: 'fa-solid fa-database', isIcon: true, visual: '🗄️' },
        cardB: { content: 'Bancos Relacionais', subtext: 'Structured Query Language', visual: '📊' },
        curiosity: 'A linguagem SQL foi criada na IBM nos anos 70 baseada no modelo relacional de Edgar F. Codd.'
      },
      {
        id: 'typescript',
        cardA: { content: 'TypeScript', icon: 'devicon-typescript-plain colored', isIcon: true, visual: '🔷' },
        cardB: { content: 'Tipagem Estática', subtext: 'Superset do JavaScript mantido pela MS', visual: '🛡️' },
        curiosity: 'TypeScript foi projetado por Anders Hejlsberg, arquiteto das linguagens C# e Turbo Pascal.'
      },
      {
        id: 'api',
        cardA: { content: 'API REST', icon: 'fa-solid fa-network-wired', isIcon: true, visual: '🔌' },
        cardB: { content: 'Integração HTTP', subtext: 'Comunicação client-server via JSON', visual: '🔄' },
        curiosity: 'O conceito REST foi formalizado por Roy Fielding em sua tese de doutorado no ano 2000.'
      },
      {
        id: 'security',
        cardA: { content: 'Criptografia', icon: 'fa-solid fa-shield-halved', isIcon: true, visual: '🔐' },
        cardB: { content: 'Segurança & HTTPS', subtext: 'Proteção ponta a ponta dos dados', visual: '🛡️' },
        curiosity: 'O protocolo HTTPS utiliza criptografia assimétrica (TLS) para proteger o tráfego da web.'
      }
    ]
  },

  // --- 2. BIOLOGIA & CIÊNCIAS DA NATUREZA ---
  {
    id: 'biology',
    title: 'Biologia Celular & Humana',
    category: 'Ciências',
    icon: 'fa-dna',
    description: 'Organelas celulares, genética e fisiologia com ícones e pares conceituais.',
    pairs: [
      {
        id: 'mitochondria',
        cardA: { content: 'Mitocôndria', subtext: 'Usina de energia celular', visual: '⚡' },
        cardB: { content: 'Respiração Celular', subtext: 'Síntese de ATP', visual: '🫁' },
        curiosity: 'As mitocôndrias possuem seu próprio DNA circular, herdado quase que exclusivamente da mãe!'
      },
      {
        id: 'chloroplast',
        cardA: { content: 'Cloroplasto', subtext: 'Pigmento verde', visual: '🌿' },
        cardB: { content: 'Fotossíntese', subtext: 'Conversão de luz em glicose', visual: '☀️' },
        curiosity: 'Os cloroplastos captam fótons solares para quebrar moléculas de água e liberar oxigênio.'
      },
      {
        id: 'dna',
        cardA: { content: 'DNA', subtext: 'Dupla hélice hereditária', visual: '🧬' },
        cardB: { content: 'Código Genético', subtext: 'Instruções da vida', visual: '📜' },
        curiosity: 'Se esticássemos o DNA de uma única célula humana, ele mediria cerca de 2 metros de comprimento!'
      },
      {
        id: 'hemoglobin',
        cardA: { content: 'Hemoglobina', subtext: 'Glóbulos vermelhos', visual: '🩸' },
        cardB: { content: 'Transporte de O₂', subtext: 'Oxigênio para os tecidos', visual: '💨' },
        curiosity: 'A hemoglobina contém átomos de ferro no grupo heme, conferindo a cor avermelhada ao sangue.'
      },
      {
        id: 'neuron',
        cardA: { content: 'Neurônio', subtext: 'Célula nervosa', visual: '🧠' },
        cardB: { content: 'Sinapses Elétricas', subtext: 'Transmissão de neurotransmissores', visual: '⚡' },
        curiosity: 'O cérebro humano possui cerca de 86 bilhões de neurônios capazes de fazer trilhões de conexões.'
      },
      {
        id: 'ribosome',
        cardA: { content: 'Ribossomo', subtext: 'Complexo molecular', visual: '🧱' },
        cardB: { content: 'Síntese Proteica', subtext: 'Tradução do RNAm', visual: '🔬' },
        curiosity: 'Os ribossomos leem o código do RNAm trinca por trinca (códon) para unir os aminoácidos.'
      },
      {
        id: 'insulin',
        cardA: { content: 'Insulina', subtext: 'Hormônio pancreático', visual: '💉' },
        cardB: { content: 'Controle de Glicose', subtext: 'Entrada de açúcar nas células', visual: '🍬' },
        curiosity: 'A insulina foi descoberta em 1921 por Banting e Best, salvando milhões de vidas com diabetes.'
      },
      {
        id: 'antibody',
        cardA: { content: 'Anticorpo', subtext: 'Imunoglobulina protetora', visual: '🛡️' },
        cardB: { content: 'Defesa Imunológica', subtext: 'Neutralização de antígenos', visual: '⚔️' },
        curiosity: 'Anticorpos são como chaves específicas criadas pelos linfócitos B para neutralizar patógenos.'
      },
      {
        id: 'vacuole',
        cardA: { content: 'Vacúolo Vegetal', subtext: 'Bolsa membranosa', visual: '💧' },
        cardB: { content: 'Reserva de Água', subtext: 'Turgor e osmorregulação', visual: '🌱' },
        curiosity: 'Nas plantas adultas, o vacúolo central pode ocupar até 90% do volume da célula vegetal!'
      },
      {
        id: 'enzyme',
        cardA: { content: 'Enzima', subtext: 'Catalisador biológico', visual: '🔑' },
        cardB: { content: 'Acelera Reações', subtext: 'Diminui a energia de ativação', visual: '⏩' },
        curiosity: 'Enzimas aumentam a velocidade das reações vitais em milhões de vezes sem serem consumidas.'
      },
      {
        id: 'platelet',
        cardA: { content: 'Plaquetas', subtext: 'Fragmentos celulares', visual: '🩹' },
        cardB: { content: 'Coagulação', subtext: 'Estancamento de hemorragias', visual: '🩸' },
        curiosity: 'As plaquetas não são células inteiras, mas fragmentos celulares essenciais para estancar sangramentos.'
      },
      {
        id: 'osmosis',
        cardA: { content: 'Osmose', subtext: 'Transporte passivo', visual: '🌊' },
        cardB: { content: 'Movimento da Água', subtext: 'Equilíbrio osmótico', visual: '⚖️' },
        curiosity: 'A osmose ocorre através de membranas semipermeáveis sem consumo de energia química (ATP).'
      }
    ]
  },

  // --- 3. QUÍMICA GERAL ---
  {
    id: 'chemistry',
    title: 'Química & Fórmulas',
    category: 'Ciências Exatas',
    icon: 'fa-flask-vial',
    description: 'Fórmulas moleculares, elementos e reações químicas do cotidiano.',
    pairs: [
      {
        id: 'water',
        cardA: { content: 'H₂O', subtext: 'Fórmula molecular', visual: '💧' },
        cardB: { content: 'Água', subtext: 'Solvente universal', visual: '🌊' },
        curiosity: 'A água possui pontes de hidrogênio responsáveis pelo seu alto calor específico e tensão superficial.'
      },
      {
        id: 'salt',
        cardA: { content: 'NaCl', subtext: 'Ligação iônica', visual: '🧂' },
        cardB: { content: 'Sal de Cozinha', subtext: 'Cloreto de Sódio', visual: '🍳' },
        curiosity: 'Composto por Sódio (metal inflamável) e Cloro (gás tóxico) que juntos formam o sal vital.'
      },
      {
        id: 'co2',
        cardA: { content: 'CO₂', subtext: 'Geometria linear', visual: '🏭' },
        cardB: { content: 'Gás Carbônico', subtext: 'Efeito estufa', visual: '☁️' },
        curiosity: 'O CO₂ sólido é o Gelo Seco, sublimando a -78,5 °C diretamente para gás!'
      },
      {
        id: 'glucose',
        cardA: { content: 'C₆H₁₂O₆', subtext: 'Monossacarídeo', visual: '🍯' },
        cardB: { content: 'Glicose', subtext: 'Energia primária celular', visual: '⚡' },
        curiosity: 'A glicose é o combustível primário que abastece o cérebro humano constantemente.'
      },
      {
        id: 'iron',
        cardA: { content: 'Fe', subtext: 'Nº Atômico 26', visual: '🔩' },
        cardB: { content: 'Ferro', subtext: 'Metal magnético', visual: '🧲' },
        curiosity: 'O ferro é o elemento final produzido por fusão no coração de grandes estrelas antes de supernovas.'
      },
      {
        id: 'gold',
        cardA: { content: 'Au', subtext: 'Do latim Aurum', visual: '👑' },
        cardB: { content: 'Ouro', subtext: 'Metal precioso nobre', visual: '✨' },
        curiosity: 'Quase todo o ouro da Terra teve origem na colisão de estrelas de nêutrons no cosmos.'
      },
      {
        id: 'methane',
        cardA: { content: 'CH₄', subtext: 'Hidrocarboneto simples', visual: '🔥' },
        cardB: { content: 'Gás Metano', subtext: 'Gás natural combustível', visual: '⛽' },
        curiosity: 'O metano é um potente gás estufa que retém mais de 25x mais calor atmosférico que o CO₂.'
      },
      {
        id: 'ph',
        cardA: { content: 'pH < 7', subtext: 'Excesso de íons H⁺', visual: '🧪' },
        cardB: { content: 'Solução Ácida', subtext: 'Escala de pH', visual: '🍋' },
        curiosity: 'O suco gástrico do nosso estômago possui pH extremamente ácido em torno de 1,5 a 2!'
      },
      {
        id: 'helium',
        cardA: { content: 'He', subtext: 'Gás Nobre inerte', visual: '🎈' },
        cardB: { content: 'Hélio', subtext: 'Mais leve que o ar', visual: '☀️' },
        curiosity: 'O hélio foi descoberto primeiro no Sol através de espectrometria antes de ser achado na Terra.'
      },
      {
        id: 'ethanol',
        cardA: { content: 'C₂H₅OH', subtext: 'Função álcool', visual: '🌾' },
        cardB: { content: 'Etanol', subtext: 'Biocombustível renovável', visual: '🚗' },
        curiosity: 'O etanol de cana-de-açúcar brasileiro é um dos combustíveis de menor emissão de carbono do mundo.'
      },
      {
        id: 'ozone',
        cardA: { content: 'O₃', subtext: 'Trioxigênio', visual: '🛡️' },
        cardB: { content: 'Camada de Ozônio', subtext: 'Filtro de raios UV', visual: '🌞' },
        curiosity: 'A camada de ozônio na estratosfera filtra até 99% da perigosa radiação ultravioleta B do Sol.'
      },
      {
        id: 'ammonia',
        cardA: { content: 'NH₃', subtext: 'Composto de nitrogênio', visual: '🌱' },
        cardB: { content: 'Amônia', subtext: 'Base para fertilizantes', visual: '🌾' },
        curiosity: 'A síntese de amônia pelo processo Haber-Bosch viabilizou a agricultura moderna no século XX.'
      }
    ]
  },

  // --- 4. GEOGRAFIA & PAÍSES ---
  {
    id: 'geography',
    title: 'Geografia & Capitais',
    category: 'Humanas',
    icon: 'fa-earth-americas',
    description: 'Países, bandeiras, capitais mundiais e pontos geográficos marcantes.',
    pairs: [
      {
        id: 'brazil',
        cardA: { content: 'Brasil', subtext: 'América do Sul', visual: '🇧🇷' },
        cardB: { content: 'Brasília', subtext: 'Capital no Planalto Central', visual: '🏛️' },
        curiosity: 'Inaugurada em 1960, Brasília foi projetada com o plano piloto desenhado por Lúcio Costa.'
      },
      {
        id: 'japan',
        cardA: { content: 'Japão', subtext: 'Ásia Oriental', visual: '🇯🇵' },
        cardB: { content: 'Tóquio', subtext: 'Maior metrópole do mundo', visual: '🗼' },
        curiosity: 'A região metropolitana da Grande Tóquio concentra mais de 37 milhões de habitantes!'
      },
      {
        id: 'france',
        cardA: { content: 'França', subtext: 'Europa Ocidental', visual: '🇫🇷' },
        cardB: { content: 'Paris', subtext: 'A Cidade Luz', visual: '🥖' },
        curiosity: 'A Torre Eiffel foi construída em 1889 como estrutura provisória para a Exposição Universal.'
      },
      {
        id: 'australia',
        cardA: { content: 'Austrália', subtext: 'Oceania', visual: '🇦🇺' },
        cardB: { content: 'Canberra', subtext: 'Capital federal planejada', visual: '🦘' },
        curiosity: 'Canberra foi construída para solucionar a disputa histórica entre Sydney e Melbourne pela capital.'
      },
      {
        id: 'canada',
        cardA: { content: 'Canadá', subtext: 'América do Norte', visual: '🇨🇦' },
        cardB: { content: 'Ottawa', subtext: 'Capital em Ontário', visual: '🍁' },
        curiosity: 'O Canadá possui o maior litoral do mundo, com mais de 202 mil quilômetros de costa!'
      },
      {
        id: 'egypt',
        cardA: { content: 'Egito', subtext: 'Norte da África', visual: '🇪🇬' },
        cardB: { content: 'Cairo', subtext: 'Às margens do Nilo', visual: '🐫' },
        curiosity: 'A Grande Pirâmide de Gizé foi a construção mais alta do planeta por mais de 3.800 anos.'
      },
      {
        id: 'germany',
        cardA: { content: 'Alemanha', subtext: 'Europa Central', visual: '🇩🇪' },
        cardB: { content: 'Berlim', subtext: 'Capital cultural', visual: '🥨' },
        curiosity: 'Berlim possui cerca de 1.700 pontes fluviais navegáveis, superando até Veneza em quantidade!'
      },
      {
        id: 'argentina',
        cardA: { content: 'Argentina', subtext: 'América do Sul', visual: '🇦🇷' },
        cardB: { content: 'Buenos Aires', subtext: 'Capital do Tango', visual: '🥩' },
        curiosity: 'A famosa Avenida 9 de Julho em Buenos Aires é uma das mais largas do mundo com 140 metros.'
      },
      {
        id: 'italy',
        cardA: { content: 'Itália', subtext: 'Península Itálica', visual: '🇮🇹' },
        cardB: { content: 'Roma', subtext: 'A Cidade Eterna', visual: '🍕' },
        curiosity: 'O Vaticano, menor país soberano do mundo, fica totalmente encravado dentro de Roma.'
      },
      {
        id: 'india',
        cardA: { content: 'Índia', subtext: 'Sul da Ásia', visual: '🇮🇳' },
        cardB: { content: 'Nova Délhi', subtext: 'Capital federal indiana', visual: '🛕' },
        curiosity: 'A Índia é atualmente o país mais populoso do planeta, com mais de 1,4 bilhão de pessoas.'
      },
      {
        id: 'south_africa',
        cardA: { content: 'África do Sul', subtext: 'Extremo sul africano', visual: '🇿🇦' },
        cardB: { content: 'Pretória', subtext: 'Capital executiva', visual: '🦁' },
        curiosity: 'A África do Sul tem 3 capitais: Pretória (executiva), Cidade do Cabo (legislativa) e Bloemfontein (judiciária).'
      },
      {
        id: 'portugal',
        cardA: { content: 'Portugal', subtext: 'Península Ibérica', visual: '🇵🇹' },
        cardB: { content: 'Lisboa', subtext: 'Capital no Rio Tejo', visual: '⛵' },
        curiosity: 'Lisboa é mais antiga do que Roma e Londres, tendo sido fundada por fenícios por volta de 1200 a.C.'
      }
    ]
  },

  // --- 5. MATEMÁTICA & FÓRMULAS ---
  {
    id: 'math',
    title: 'Matemática & Teoremas',
    category: 'Exatas',
    icon: 'fa-calculator',
    description: 'Teoremas célebres, constantes matemáticas e fórmulas fundamentais.',
    pairs: [
      {
        id: 'pythagoras',
        cardA: { content: 'Pitágoras', subtext: 'Triângulo Retângulo', visual: '📐' },
        cardB: { content: 'a² + b² = c²', subtext: 'Hipotenusa e Catetos', visual: '📏' },
        curiosity: 'O teorema de Pitágoras era utilizado por babilônios e egípcios para demarcar terras após enchentes.'
      },
      {
        id: 'pi',
        cardA: { content: 'Constante Pi (π)', subtext: 'Razão do círculo', visual: '🥧' },
        cardB: { content: '3,14159...', subtext: 'Perímetro / Diâmetro', visual: '⭕' },
        curiosity: 'Pi é um número irracional e transcendental: possui infinitas casas decimais sem nenhuma repetição periódica.'
      },
      {
        id: 'circle_area',
        cardA: { content: 'Área do Círculo', subtext: 'Geometria plana', visual: '🎯' },
        cardB: { content: 'A = π · r²', subtext: 'Pi vezes raio²', visual: '🔴' },
        curiosity: 'Arquimedes demonstrou que a área do círculo é igual à de um triângulo com base no perímetro e altura no raio.'
      },
      {
        id: 'bhaskara',
        cardA: { content: 'Equação de 2º Grau', subtext: 'ax² + bx + c = 0', visual: '🔢' },
        cardB: { content: 'Δ = b² - 4ac', subtext: 'Fórmula resolutiva', visual: '📊' },
        curiosity: 'Embora no Brasil chamemos de Bhaskara, a fórmula quadrática geral foi desenvolvida por vários matemáticos árabes e hindus.'
      },
      {
        id: 'euler',
        cardA: { content: 'Número de Euler (e)', subtext: 'Base neperiana', visual: '📈' },
        cardB: { content: '2,71828...', subtext: 'Crescimento contínuo', visual: '🌱' },
        curiosity: 'A constante e surge naturalmente em equações diferenciais de juros compostos contínuos e biologia.'
      },
      {
        id: 'fibonacci',
        cardA: { content: 'Fibonacci', subtext: '0, 1, 1, 2, 3, 5, 8...', visual: '🐚' },
        cardB: { content: 'Razão Áurea (φ)', subtext: 'Proporção 1,618', visual: '🌻' },
        curiosity: 'A proporção áurea de Fibonacci aparece na distribuição de sementes do girassol e na concha do nautilus.'
      },
      {
        id: 'triangle_angles',
        cardA: { content: 'Ângulos no Triângulo', subtext: 'Geometria euclidiana', visual: '🔺' },
        cardB: { content: 'Soma = 180°', subtext: 'Soma dos ângulos internos', visual: '🔄' },
        curiosity: 'Essa regra vale no plano; em uma superfície esférica como a Terra, a soma dos ângulos pode passar de 270°!'
      },
      {
        id: 'speed_physics',
        cardA: { content: 'Velocidade Média', subtext: 'Cinemática', visual: '⏱️' },
        cardB: { content: 'v = Δs / Δt', subtext: 'Distância pelo tempo', visual: '🏎️' },
        curiosity: 'A luz no vácuo viaja a aproximadamente 300.000 km por segundo, a velocidade máxima do universo.'
      },
      {
        id: 'newton_2nd',
        cardA: { content: '2ª Lei de Newton', subtext: 'Dinâmica física', visual: '🚀' },
        cardB: { content: 'F = m · a', subtext: 'Força = Massa × Aceleração', visual: '💥' },
        curiosity: 'A lei fundamental da dinâmica explica o lançamento de foguetes e a gravidade formuladas por Newton em 1687.'
      },
      {
        id: 'einstein',
        cardA: { content: 'Relatividade', subtext: 'Massa e Energia', visual: '⚛️' },
        cardB: { content: 'E = m · c²', subtext: 'Energia = Massa × Luz²', visual: '☀️' },
        curiosity: 'Mostra que até uma única grama de matéria guarda uma quantidade imensa de energia atômica.'
      },
      {
        id: 'golden_ratio',
        cardA: { content: 'Número de Ouro', subtext: 'Proporção divina', visual: '✨' },
        cardB: { content: 'φ ≈ 1,618', subtext: '(1 + √5) / 2', visual: '🎨' },
        curiosity: 'Pintores renascentistas como Da Vinci usavam essa proporção para harmonizar o olhar humano em suas obras.'
      },
      {
        id: 'logarithm',
        cardA: { content: 'Logaritmo', subtext: 'log_b(a) = x', visual: '🧮' },
        cardB: { content: 'b^x = a', subtext: 'Inversa da exponencial', visual: '🔑' },
        curiosity: 'John Napier inventou os logaritmos no século XVII para poupar tempo em cálculos astronômicos gigantescos.'
      }
    ]
  },

  // --- 6. IDIOMAS & VOCABULÁRIO (INGLÊS) ---
  {
    id: 'languages',
    title: 'Idiomas & Vocabulário (Inglês)',
    category: 'Linguagens',
    icon: 'fa-language',
    description: 'Palavras-chave em inglês associadas ao seu significado com imagens ilustrativas.',
    pairs: [
      {
        id: 'knowledge',
        cardA: { content: 'Knowledge', subtext: 'Inglês', visual: '📖' },
        cardB: { content: 'Conhecimento', subtext: 'Português', visual: '💡' },
        curiosity: '"Knowledge is power" (Conhecimento é poder) é uma famosa máxima atribuída ao filósofo Francis Bacon.'
      },
      {
        id: 'challenge',
        cardA: { content: 'Challenge', subtext: 'Inglês', visual: '🧗' },
        cardB: { content: 'Desafio', subtext: 'Português', visual: '🎯' },
        curiosity: 'Superar "challenges" constantes é o principal gatilho do cérebro para desenvolver neuroplasticidade.'
      },
      {
        id: 'breakthrough',
        cardA: { content: 'Breakthrough', subtext: 'Inglês', visual: '🚀' },
        cardB: { content: 'Avanço / Inovação', subtext: 'Português', visual: '🔬' },
        curiosity: 'Termo utilizado na ciência para saltos tecnológicos que rompem paradigmas anteriores.'
      },
      {
        id: 'resilience',
        cardA: { content: 'Resilience', subtext: 'Inglês', visual: '🌳' },
        cardB: { content: 'Resiliência', subtext: 'Português', visual: '🛡️' },
        curiosity: 'Originalmente da física, descreve a capacidade de um corpo recuperar a forma após sofrer pressão.'
      },
      {
        id: 'mindset',
        cardA: { content: 'Mindset', subtext: 'Inglês', visual: '🧠' },
        cardB: { content: 'Mentalidade', subtext: 'Português', visual: '⚙️' },
        curiosity: 'Carol Dweck provou que a mentalidade de crescimento potencializa o aprendizado em qualquer idade.'
      },
      {
        id: 'skills',
        cardA: { content: 'Skills', subtext: 'Inglês', visual: '🛠️' },
        cardB: { content: 'Habilidades', subtext: 'Português', visual: '⭐' },
        curiosity: 'No mundo profissional moderno dividem-se em Hard Skills (técnicas) e Soft Skills (comportamentais).'
      },
      {
        id: 'feedback',
        cardA: { content: 'Feedback', subtext: 'Inglês', visual: '🗣️' },
        cardB: { content: 'Retorno Formativo', subtext: 'Português', visual: '🔄' },
        curiosity: 'O feedback rápido e construtivo é o pilar mais eficaz para a retenção de novos conhecimentos.'
      },
      {
        id: 'teamwork',
        cardA: { content: 'Teamwork', subtext: 'Inglês', visual: '🤝' },
        cardB: { content: 'Trabalho em Equipe', subtext: 'Português', visual: '👥' },
        curiosity: 'Times colaborativos produzem soluções mais criativas através da sinergia de diferentes perspectivas.'
      },
      {
        id: 'growth',
        cardA: { content: 'Growth', subtext: 'Inglês', visual: '🌱' },
        cardB: { content: 'Crescimento', subtext: 'Português', visual: '📈' },
        curiosity: 'Diz respeito ao aprendizado contínuo (Life-long learning), essencial na sociedade do conhecimento.'
      },
      {
        id: 'achievement',
        cardA: { content: 'Achievement', subtext: 'Inglês', visual: '🏆' },
        cardB: { content: 'Conquista', subtext: 'Português', visual: '🎖️' },
        curiosity: 'Alcançar metas estimula a liberação de dopamina, o neurotransmissor natural de recompensa do cérebro.'
      },
      {
        id: 'insight',
        cardA: { content: 'Insight', subtext: 'Inglês', visual: '💡' },
        cardB: { content: 'Percepção Clara', subtext: 'Português', visual: '👁️' },
        curiosity: 'O clássico momento "Eureca!", quando uma solução criativa se revela espontaneamente à mente.'
      },
      {
        id: 'leadership',
        cardA: { content: 'Leadership', subtext: 'Inglês', visual: '🧭' },
        cardB: { content: 'Liderança', subtext: 'Português', visual: '👑' },
        curiosity: 'Liderar na educação moderna significa guiar pelo exemplo e dar autonomia para os alunos brilharem.'
      }
    ]
  }
];

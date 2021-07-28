# CT Puzzle Platform
- Aplicação para medição de pensamento computacional por meio de puzzles
- Os puzzles são games externos à plataforma, mas que são configurados por ela.
- Permite especificar mecânicas dos itens, especificar suas estruturas por meio de classes
- Os eventos de resposta são armazenados por meio de uma api no banco de dados
- A partir dos dados de resposta é feito o cálculo da dificuldade e discriminação dos itens

## Conceitos
- Mecânica: configuração de atributos de puzzle
- Função de cálculo de escore: código que informa a nota do participante a partir da resposta a item
- Item: uso das configurações de atributos
- Teste: lista ordenada de itens
- Aplicação de teste: sessão de recebimento de respostas

### Mecânica
 Essa estrutura refere-se ao tipo de puzzle: são as propriedades que um determinado tipo de puzzle tem. Exemplo: a mecânica de programação tem um ponto de partida, um tamanho de mapa, um melhor caminho a ser percorrido, obstáculos e objetivos. A mecânica para um jogo de ligação de pontos tem uma lista de coordenadas (x,y) e arestas. Há também a possibilidade de adicionar dicas e outras configurações. Em suma, a mecânica define atributos que os itens de tal tipo devem especificar: na fase de programação 1, o personagem pode começar na posição (3,4), na fase 4 começar na posição (1,2) por exemplo.
 A codificação da mecânica é feita em TypeScript:
 
 
    class ItemProgramacao {
        // Cenário
        mapa!: Mapa[][];
        obstaculos!: Obstaculo[][];
        face!: Face;
        x: number = 0;
        y: number = 0;

        // Energia
        nivelBateria: number = 10
        nivelMaximoBateria: number = 10
        custoBateriaEmCadaMovimento: number = 1
        ganhoBateriaAoCapturarPilha: number = 2

        // Valores esperados
        comandosEsperados!: Comando[];
        tempoEsperado!: number
        tentativasEsperadas!: number
        numeroMinimoComandos!: number
        numeroMinimoPassos!: number

        // Tutoriais e mensagens
        acoesTutorial: AcaoTutorial[] = []
        falasAntesDeIniciar: string[] = []
        mensagemAoPularFase: string = 'Tem certeza que deseja pular essa fase?'
        mensagemAoSairDoJogo: string = 'Tem certeza de que deseja sair?';
        
    }


## Tecnologia
- Nestjs (backend)
- Nuxtjs (frontend)
- Docker (Container)
- Gitlab (CI/CD)
- Postgres (Banco)
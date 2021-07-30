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

## Mecânica
 Essa estrutura refere-se ao tipo de puzzle: são as propriedades que um determinado tipo de puzzle tem. Exemplo: a mecânica de programação tem um ponto de partida, um tamanho de mapa, um melhor caminho a ser percorrido, obstáculos e objetivos. A mecânica para um jogo de ligação de pontos tem uma lista de coordenadas (x,y) e arestas. Há também a possibilidade de adicionar dicas e outras configurações. Em suma, a mecânica define atributos que os itens de tal tipo devem especificar: na fase de programação 1, o personagem pode começar na posição (3,4), na fase 4 começar na posição (1,2) por exemplo.
 A codificação da mecânica é feita em TypeScript:

 ### Classe de item
 Posição de objetos, tamanho de mapa, dificuldade, tempo esperado de resolução, número de vidas são exemplos de atributos.
  
    class ItemProgramacao {
        mapa!: string[][];
        dificuldade!: number[][];
        numeroVidas!: number
        tempoEsperadoResolucao!: number
    }

### Classe de resposta
Tempo de resposta, número de erros, solução informada, número de tentativas são exemplos de atributos.

    class Resposta {
            numeroErros!: number;
            solucaoInformada!: string[];
            numeroTentativas!: number;
    }

<!-- # Telas
explicando sobre o uso da ferramenta de codificação, uso da função de cálculo de escore, como recalcular os escores após atualizar a função de aplicação e como criar casos de teste para validar respostas diversas.

# Como desenvolver e conectar puzzles na plataforma
Esse capítulo do manual, seria direcionado a pesquisadores com experiência em programação. Descreveria o passo a passo do uso do endereço de aplicação, obtenção dos dados, apresentação dos itens, manutenção de estado do jogo para casos de interrupção, envio de respostas e testes de itens criados.

# Como interpretar e utilizar o módulo estatístico
Esse capítulo do manual explica como utilizar os componentes da tela de estatística de forma a obter melhor proveito.
Explica sobre as diferentes formas de utilizar cada componente, comparar grupos de teste e controle e como interpretar as curvas de dificuldade e probabilidade de acerto.

## Tecnologia
- Nestjs (backend)
- Nuxtjs (frontend)
- Docker (Container)
- Gitlab (CI/CD)
- Postgres (Banco) -->
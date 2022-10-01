# CT Puzzle Platform
- Aplicação para medição de pensamento computacional por meio de puzzles
- Os puzzles são games externos à plataforma, mas que são configurados por ela.
- Permite especificar mecânicas dos itens, especificar suas estruturas por meio de classes
- Os eventos de resposta são armazenados por meio de uma api no banco de dados
- A partir dos dados de resposta é feito o cálculo da dificuldade e discriminação dos itens seguindo TRI politômica

## Tecnologia
- Nestjs (backend)
- Nuxtjs (frontend)
- Docker (Container)
- Gitlab (CI/CD)
- Postgres (Banco)

## Como rodar
Instalar postgres (https://www.postgresql.org/download/)
gunzip dump2022-10-01-03-00.sql.gz
psql -U postgres -h localhost
create database ct_puzzle_platform with owner postgres
psql -U postgres -h localhost -d ct_puzzle_plataform < dump2022-10-01-03-00.sql

Substituir credenciais no arquivo .env.dev
TYPEORM_PASSWORD=****

## No Visual Studio Code
Abrir pasta raiz CTPuzzlePlatform
Run > Start Debugging (F5)
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
- Postgres (Banco de dados)
- Docsify (Documentação) https://docsify.js.org/#/?id=docsify
- Postgres v12 (Banco)
- Deno https://deno.com/manual@v1.34.0/introduction

## Versões
- node 12.21.0
- postgresql 12

## Pré-requisitos
- nvm
- node
- docker
- vscode

## Preparar para desenvolver

### Frontend
```
cd frontend
nvm use 12.21.0
npm install
```

### Backend
```
cd backend
nvm use 12.21.0
npm install
```

### Instalar postgres
A instalação do postgres pode ser feita via docker e docker-compose
```
docker-compose --file docker-compose.database-only.yml --env .env.database-only up
```

### Iniciar a base de dados
```
gunzip dump2022-10-01-03-00.sql.gz
psql -U postgres -h localhost -p 5656 -c "create database ct_puzzle_platform with owner postgres"
psql -U postgres -h localhost -p 5656 -d ct_puzzle_platform < dump2022-10-01-03-00.sql
```

### Senha do banco
A senha do banco de dados deve ser informada para que o typeorm possa acessar a base.
A configuração é feita nos seguintes arquivos
#### .env.database-only
arquivo de env utilizado pelo docker-compose
#### .env.dev 
arquivo de variáveis de ambiente que o vscode utiliza ao subir a aplicação
- Informe a senha na variável TYPEORM_PASSWORD

### Deno
O deno é um interpretador typescript como o node. 
É utilizado para executar a função que calcula a nota de cada item.
```
./install-deno.sh
```

### Email
Ao cadastrar-se na aplicação, a plataforma manda um email.
As configs de email são feitas no arquivo .env.dev e devem ser ajustadas.


## Rodar
- Abrir pasta raiz CTPuzzlePlatform
- Run > Start Debugging (F5)

### Tipos de run
- Backend
- Frontend
- Backend + Frontend (roda os dois de uma vez)
- Backend + Frontend + Docs (roda os dois e gera a doc)

## Tasks úteis
No arquivo tasks.json do vscode há diferentes tasks úteis. Confira lá. Algumas são:
- Rodar migrations
- Instalar gerador de documentção
- Buildar imagem docker da aplicação para rodar localmente
- Rodar imagem docker da aplicação gerada

## TODOs
- Implementar uma forma segura de guardar a senha e login
- Adicionar aviso de cookies para atender a LGPD
- Revisar o método de geração da CCI

## Ideias
- Integrar com gerador de dashboards como Grafana
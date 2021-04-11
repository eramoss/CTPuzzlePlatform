# Rodar depois que o build no gitlab estiver pronto
ssh cassiano@playerweb.com.br "cd ~/projetos/ct-puzzle-platform/ && docker-compose pull && docker-compose up -d"

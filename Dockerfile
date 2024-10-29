# Use a imagem oficial do Node.js
FROM node:18.16

# Defina o diretório de trabalho
WORKDIR /app

# Instale o Vite globalmente (opcional)
RUN npm install -g vite

# Copie os arquivos de dependências
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie todo o código fonte da aplicação
COPY . .

# Exponha a porta que o Vite vai utilizar
EXPOSE 5173

# Inicie o servidor em modo de desenvolvimento
CMD ["npm", "run", "dev"]

FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies fresh
RUN npm install

# Optional: install nodemon globally
RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "server.js"]

FROM node:16.15.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm i -g @nestjs/cli && npm install -g npm@8.19.2 && npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]

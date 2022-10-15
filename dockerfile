FROM node:16.15.1-alpine3.14

RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm i -g @nestjs/cli && npm install

# Bundle app source
COPY --chown=node:node . .

RUN npm run build

EXPOSE 3000
CMD [ "node", "dist/main.js" ]

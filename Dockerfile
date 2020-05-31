FROM node:12
COPY package*.json ./

COPY . .

RUN npm ci

EXPOSE 3000
CMD npm run compile && npm run start

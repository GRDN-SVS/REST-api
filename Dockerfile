FROM node:12
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .
EXPOSE 3000
RUN npm run compile
CMD npm run start
# RUN npm run compile
# RUN npm run start

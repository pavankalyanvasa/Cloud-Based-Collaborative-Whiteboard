FROM node:14.15


WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]
FROM amd64/alpine

RUN apk add --update nodejs npm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 80

CMD [ "npm", "start" ]
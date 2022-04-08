FROM node:16.13.0
COPY . /app
RUN cd /app && npm i
WORKDIR /app
CMD [ "npm", "start" ]
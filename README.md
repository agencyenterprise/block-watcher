# Watching of contract events simplified

A docker container that simplifies watching, handling (and listening to that handle with a websocket) and live logging blockchain contract events.

## Running the docker image

Create a docker-compose.yml

### Add contracts on the fly

You can use this API doc to interact with the API:

https://documenter.getpostman.com/view/18943422/UVyxRZqd

````
version: '3'
services:
  listener:
    image: agencyenterprisestudio/block-watcher
    ports:
      - '3000:3000'
      - '80:80'
    environment:
      - PORT=3000
      - NETWORK_TYPE=evm
    volumes:
      - ./storage:/app/storage
````

### Listen to a single contract

````
version: '3'
services:
  listener:
    image: agencyenterprisestudio/block-watcher
    ports:
      - '3000:3000'
      - '80:80'
    environment:
      - PORT=3000
      - NETWORK_TYPE=evm
      - WEBHOOK_URL={YOUR-APP-WEBHOOK}
      - CONTRACT_ABI_URL={LINK-TO-ABI}
      - CONTRACT_ADDRESS={YOUR-CONTRACT-ADDRESS}
      - PROVIDER_URL={YOUR-WEB3-PROVIDER-URL}
      - CHECK_INTERVAL={TIME-IN-MS}
      - LAST_PROCESSED_BLOCK={LAST-PROCESSED-BLOCK-NUMBER}
    volumes:
      - ./storage:/app/storage
````

### All options

````
version: '3'
services:
  listener:
    image: agencyenterprisestudio/block-watcher
    ports:
      - '3000:3000'
      - '80:80'
    environment:
      - PORT=3000
      - NETWORK_TYPE=evm
      - WEBHOOK_URL={YOUR-APP-WEBHOOK}
      - CONTRACT_ABI_URL={LINK-TO-ABI}
      - CONTRACT_ADDRESS={YOUR-CONTRACT-ADDRESS}
      - PROVIDER_URL={YOUR-WEB3-PROVIDER-URL}
      - CHECK_INTERVAL={TIME-IN-MS}
      - LAST_PROCESSED_BLOCK={LAST-PROCESSED-BLOCK-NUMBER}
    volumes:
      - ./storage:/app/storage
````

## Available settings | variables

### PORT

The port you'll be using for the socket application.

### WEBHOOK_URL

The webhook url you can use to send the events for processing. the data sent to the 

### NETWORK_TYPE

The container currently supports evm based network types. You can set ```evm```.

### CONTRACT_ABI_URL

A public URL where the container can fetch the contract ABI JSON in order to process the events.

### CONTRACT_ADDRESS

The address of the contract you want to watch.

### PROVIDER_URL

The URL of your network provider.

### CHECK_INTERVAL

The time in MS in which the watcher will fetch the contract blocks.

## Connecting to the socket

We're using the socket to listen to events once they're fully processed. Let's say you have an event listener for when a purchase is processed, you can use the socket in the interface to watch it.

````Javascript
const socket = io('http://localhost:3000')
socket.on('CONTRACT_EVENT_HANDLED', event => {
  console.log('event', event)
})
````
# Watching of contract events simplified

A docker container that simplifies watching, handling (and listening to that handle with a websocket) and live logging blockchain contract events.

You can use it as docker container or as a installable npm library to extend its implementations.

## Running the docker image

````
docker run ae.studio/block-watcher
-e PORT=3000
-e WEBHOOK_URL={YOUR-APP-WEBHOOK}
-e NETWORK_TYPE={evm|flow}
-e CONTRACT_ABI_URL={LINK-TO-ABI}
-e CONTRACT_ADDRESS={YOUR-CONTRACT-ADDRESS}
-e PROVIDER_URL={YOUR-WEB3-PROVIDER-URL}
-e CHECK_INTERVAL={TIME-IN-MS}
````

## Available settings

### PORT

The port you'll be using for the socket application.

### WEBHOOK_URL

The webhook url you can use to send the events for processing. the data sent to the 

### NETWORK_TYPE

The container currently supports evm based networks types and flow. you can set either ```evm``` or ```flow```.

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
const socket = io('localhost:3000')
socket.on('CONTRACT_EVENT_HANDLED', event => {
  console.log('event', event)
})
````
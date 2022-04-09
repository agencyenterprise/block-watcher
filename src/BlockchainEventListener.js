const io = require('./socket')
const fs = require('fs')

module.exports = class BlockchainEventListener {
  events = {}
  on(eventType, eventHandler) {
    this.events[eventType] = eventHandler;
  }
  emit(eventType, data) {
    this.events[eventType] && this.events[eventType](data)
    io.to('current-contract').emit('CONTRACT-EVENT-HANDLED', data)
  }
  saveLastProcessedBlock(contractAddress, lastProcessedBlock) {
    return fs.writeFileSync(`./storage/blocks/${contractAddress}.block`, String(lastProcessedBlock))
  }
  getLastProcessedBlock(contractAddress) {
    try {
      const lastBlock = fs.readFileSync(`./storage/blocks/${contractAddress}.block`)
      return parseInt(lastBlock)
    } catch(e) {
      console.log(e.message)
      return 0
    }
  }
}
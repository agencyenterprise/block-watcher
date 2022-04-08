const io = require('./socket')
const fs = require('fs')

module.exports = class BlockchainEventListener {
  events = {}
  on(eventType, eventHandler) {
    this.events[eventType] = eventHandler;
  }
  emit(eventType, data) {
    this.events[eventType] && this.events[eventType](data)
    console.log(eventType, data)
    io.to('current-contract').emit('CONTRACT-EVENT-HANDLED', data)
  }
  saveLastProcessedBlock(lastProcessedBlock) {
    return fs.writeFileSync('./blocks/lpb.block', String(lastProcessedBlock))
  }
  getLastProcessedBlock() {
    try {
      const lastBlock = fs.readFileSync('./blocks/lpb.block')
      return parseInt(lastBlock)
    } catch(e) {
      console.log(e.message)
      return 0
    }
  }
}
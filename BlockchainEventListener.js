const io = require('./socket')

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
}
const BlockchainEventListener = require('./BlockchainEventListener.js')
const Web3 = require('web3')
const Axios = require('axios')

module.exports = class EvmListener extends BlockchainEventListener {
  fromBlock = 0
  lastProcessedBlock = 0
  webhookUrl = null
  contract = null
  contractAddress = null
  checkInterval = 1000
  constructor(data) {
    super()
    this.web3 = new Web3(data.providerUrl)
    this.init(data)
  }
  setSettings(data) {
    this.webhookUrl = data.webhookUrl
    this.webhookHeaders = data.headers
    this.checkInterval = data.checkInterval
    this.contractAddress = data.contractAddress
    this.lastProcessedBlock = data.lastProcessedBlock
  }
  async fetchContractAbi(contractUri) {
    const { data } = await Axios.get(contractUri)
    return JSON.parse(data.result)
  }
  async init(data) {
    try {
      this.setSettings(data)
      const contractAbi = await this.fetchContractAbi(data.contractUri)
      this.contract = new this.web3.eth.Contract(contractAbi, data.contractAddress)
      this.check()
    } catch(e) {
      console.error(e)
    }
  }
  async check() {
    try {
      const _fromBlock = this.getLastProcessedBlock(this.contractAddress)
      this.fromBlock = _fromBlock || this.lastProcessedBlock || 0
      const events = await this.contract.getPastEvents('allEvents', { fromBlock: this.fromBlock, toBlock: 'latest' })
      await this.process(events)
    } catch(e) {
      console.error(e)
    }
    setTimeout(() => this.check(), this.checkInterval)
  }
  async process(events) {
    for(let event of events) {
      if(event.blockNumber === this.fromBlock) {
        console.log(event.blockNumber, 'already processed, skipping.');
        continue;
      }
      const response = await Axios.post(this.webhookUrl, event, { headers: this.webhookHeaders })
      this.emit(event.event, { originalEvent: event, webhookResponse: response.data })
      this.saveLastProcessedBlock(this.contractAddress, event.blockNumber)
    }
  }
}
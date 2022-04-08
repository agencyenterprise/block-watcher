const BlockchainEventListener = require('./BlockchainEventListener.js')
const Web3 = require('web3')
const Axios = require('axios')

module.exports = class EvmListener extends BlockchainEventListener {
  fromBlock = 0
  webhookUrl = null
  contract = null
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
    const _fromBlock = this.getLastProcessedBlock()
    console.log(_fromBlock)
    this.fromBlock = _fromBlock || data.lastProcessedBlock || 0
  }
  async fetchContractAbi(contractUri) {
    const { data } = await Axios.get(contractUri)
    return JSON.parse(data.result)
  }
  async init(data) {
    this.setSettings(data)
    const contractAbi = await this.fetchContractAbi(data.contractUri)
    console.log(contractAbi)
    this.contract = new this.web3.eth.Contract(contractAbi, data.contractAddress)
    this.check()
  }
  async check() {
    const events = await this.contract.getPastEvents('allEvents', { fromBlock: this.fromBlock, toBlock: 'latest' })
    await this.process(events)
    setTimeout(() => this.check(), this.checkInterval)
  }
  async process(events) {
    for(let event of events) {
      const response = await Axios.post(this.webhookUrl, event, { headers: this.webhookHeaders })
      this.emit(event.event, { originalEvent: event, webhookResponse: response.data })
      console.log(event.blockNumber)
      this.saveLastProcessedBlock(event.blockNumber)
    }
  }
}
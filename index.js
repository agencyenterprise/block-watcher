require('dotenv').config()

const EvmListener = require('./src/evm')
const express = require('express')
const app = express()

const chains = {
  evm: EvmListener,
}

app.use(express.static('public'))

app.post('/webhook', (req, res) => {
  console.log(req.body)
  return res.status(200).send({})
})

app.listen(80, () => console.log('here'))

const listener = new chains[process.env.NETWORK_TYPE]({
  webhookUrl: process.env.WEBHOOK_URL,
  contractUri: process.env.CONTRACT_ABI_URL,
  contractAddress: process.env.CONTRACT_ADDRESS,
  providerUrl: process.env.PROVIDER_URL,
  checkInterval: process.env.CHECK_INTERVAL,
  lastProcessedBlock: process.env.LAST_PROCESSED_BLOCK,
})

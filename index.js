require('dotenv').config()

const EvmListener = require('./src/evm')
const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

const chains = {
  evm: EvmListener,
}

app.use(bodyParser.json({ type: 'application/json' }))

app.use(express.static('public'))

app.post('/webhook', (req, res) => {
  console.log(req.body)
  return res.status(200).send({})
})

const readSettingsFile = () => {
  try {
    const file = fs.readFileSync('./storage/contracts.json')
    return JSON.parse(file)
  } catch(_) {
    return []
  }
}

app.post('/contract', (req, res) => {
  const settings = readSettingsFile()
  const currentSettings = settings.find(setting => setting.contractAddress === req.body.contractAddress)
  if(!currentSettings) {
    settings.push(req.body)
  }
  fs.writeFileSync('./storage/contracts.json', JSON.stringify(settings))
  initContractListeners()
  return res.status(200).send({ message: 'Contract Updated' })
})

app.delete('/contract/:contractAddress', (req, res) => {
  const settings = readSettingsFile()
  const filteredSettings = settings.filter(setting => {
    console.log(setting.contractAddress, req.params.contractAddress, setting.contractAddress != req.params.contractAddress)
    return setting.contractAddress != req.params.contractAddress
  })
  fs.writeFileSync('./storage/contracts.json', JSON.stringify(filteredSettings))
  initContractListeners()
  return res.status(200).send({ message: 'Contract Updated' })
})

app.listen(80, () => console.log(`listening on ${80}`))

const contractListeners = {};

const initContractListeners = () => {

  const settings = readSettingsFile()
  
  if(process.env.CONTRACT_ADDRESS) {
    settings.push({
      webhookUrl: process.env.WEBHOOK_URL,
      contractUri: process.env.CONTRACT_ABI_URL,
      contractAddress: process.env.CONTRACT_ADDRESS,
      providerUrl: process.env.PROVIDER_URL,
      checkInterval: process.env.CHECK_INTERVAL,
      lastProcessedBlock: process.env.LAST_PROCESSED_BLOCK,
    })
  }

  for(let contractSettings of settings) {
    if(!contractListeners[contractSettings?.contractAddress]) {
      contractListeners[contractSettings.contractAddress] = new chains[process.env.NETWORK_TYPE](contractSettings)
    }
  }

  for(let key in contractListeners) {
    if(!settings.find(setting => setting.contractAddress === key)) {
      delete contractListeners[key]
    }
  }

}

initContractListeners()

const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let applicationReceiver
let applicationTaskReceiver

async function stop () {
  await applicationReceiver.closeConnection()
  await applicationTaskReceiver.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

module.exports = {
  ApplicationReceiver: async function (applicationReceived) {
    const updateAction = msg => applicationReceived(msg, applicationReceiver)
    applicationReceiver = new MessageReceiver(msgCfg.applicationSubscription, updateAction)
    await applicationReceiver.subscribe()
  },
  ApplicationTaskReceiver: async function (applicationTaskReceived) {
    const updateAction = msg => applicationTaskReceived(msg, applicationTaskReceiver)
    applicationTaskReceiver = new MessageReceiver(msgCfg.applicationTaskSubscription, updateAction)
    await applicationTaskReceiver.subscribe()
  }
}

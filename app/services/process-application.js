const { set } = require('../repositories/application-repository')

module.exports = async function (msg, applicationReceiver) {
  try {
    await set({
      reference: msg.body.confirmationId,
      grant_type: 'SGS001',
      data: JSON.stringify(msg.body),
      created_by: 'admin',
      updated_by: 'admin',
      updated_at: new Date(),
      created_at: new Date()
    })
    applicationReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await applicationReceiver.abandonMessage(msg)
  }
}

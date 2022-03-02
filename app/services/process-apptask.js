const { set } = require('../repositories/applicationstage-repository')

module.exports = async function (msg, applicationTaskReceiver) {
  const msgBody = msg.body
  try {
    console.log(msgBody, 'msgBody')
    await set({
      appref: msgBody.appref,
      stageid: msgBody.stageId,
      created_by: 'admin',
      updated_by: 'admin',
      updated_at: new Date(),
      created_at: new Date(),
      sla: msgBody.sla ? JSON.stringify(msgBody.sla) : null
    })
    applicationTaskReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await applicationTaskReceiver.abandonMessage(msg)
  }
}

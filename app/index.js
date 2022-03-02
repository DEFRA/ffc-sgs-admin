const createServer = require('./server')
const processApplicationAction = require('./services/process-application')
const processApplicationTaskAction = require('./services/process-apptask')
const slaService = require('./services/sla-service')
const { ApplicationReceiver, ApplicationTaskReceiver } = require('./messaging/receivers')
const cron = require('node-cron')
const init = async () => {
  ApplicationReceiver(processApplicationAction)
  ApplicationTaskReceiver(processApplicationTaskAction)
  const server = await createServer()
  await server.start()
  console.log('Server running on %s', server.info.uri)
  cron.schedule('* * * * *', () => { slaService.getAllSlaTasks(); console.log('Task is running every minute ' + new Date()) })
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

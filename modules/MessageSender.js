const logger = require('./logger')
const amq = require('./amq')
const args = process.argv.slice(2);

init()

async function init () {

    // Connect to RabbitMQ (terminate process on failure)
    await testConnection ()
    logger.error(args);
    queueNotification(args[0], {env:args[1]})
}

async function testConnection () {
    // Connect to RabbitMQ (terminate process on failure)
    try {
        await amq.connect()
        logger.info('Successfully connected to RabbitMQ.')
    } catch (error) {
        logger.error('[FATAL] Failed to establish initial connection with RabbitMQ. Exiting in 5 seconds...')
        logger.error(error)
        await setTimeout(() => {}, 5000)
        process.exit(-1)
    }

}

//============================================================
//
//
//============================================================
async function queueNotification(routingKey, data) {

  try {
      let response = await amq.publish('amq.topic', routingKey, data);
      logger.error(response)
  } catch (error) {
      logger.error('[FATAL] Failed to to send message to RabbitMQ. Exiting in 5 seconds...')
      logger.error(error)
      await setTimeout(() => {}, 5000)
      process.exit(-1)
  }
    return true
}

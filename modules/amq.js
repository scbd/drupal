const amqp = require('amqplib')
const config = {url:'amqp://localhost:5672'}
const logger = require('./logger')

module.exports = exports = class Amq {
  // ============================================================
  //
  // ============================================================
  static async connect () {
    if (Amq.GLOBALCONNECTION) return Amq.GLOBALCONNECTION

    let urls = config.url.split(',')

    Amq.GLOBALCONNECTION = await Promise.race(urls.map(async function (url) {
      let connection = await amqp.connect(url)

      connection.url = url

      connection.on('error', function (error) {
        logger.error('[FATAL] RabbitMQ connection closed unexpectedly. Exiting in 5 seconds...')
        logger.debug(error)
        setTimeout(() => process.exit(-1), 5000)
      })

      return connection
    }))
    return Amq.GLOBALCONNECTION
  }

  // ============================================================
  //
  // ============================================================
  static async createChannel () {
    let connection = await this.connect()
    let channel = await connection.createChannel()

    return channel
  };

  // ============================================================
  //
  // ============================================================
  static async assertExchange (exchange, type, options) {
    let channel = await this.createChannel()

    await channel.assertExchange(exchange, type, options)
    return true
  };

  // ============================================================
  //
  // ============================================================
  static async assertQueue (queue, options) {
    let channel = await this.createChannel()

    await channel.assertQueue(queue, options)
    return true
  };

  // ============================================================
  //
  // ============================================================
  static async bindQueue (queue, exchange, routingKey, userArguments) {
    let channel = await this.createChannel()

    await channel.bindQueue(queue, exchange, routingKey, userArguments)
    return true
  };

  // ============================================================
  //
  // ============================================================
  static async consume (queue, callback) {
    let channel = await this.createChannel()

    channel.prefetch(1)

    setTimeout(() => internalConsume(), 0)

    function internalConsume () {
      channel.consume(queue, async function (message) {
        try {
          await callback(JSON.parse(message.content))

          await channel.ack(message)
        } catch (err) {
          await channel.cancel(message.fields.consumerTag)

          setTimeout(() => channel.nack(message), 30000)
          setTimeout(() => internalConsume(channel), 0)

          logger.error(`UNHANDLED EXCEPTION: ${err}`, { routingKey: message.fields.routingKey, message: message.content.toString(), stack: err.stack })
        }
      }, { noAck: false })
    }
  };

  // ============================================================
  //
  // ============================================================
  static async publish (exchange, routingKey, content, options) {
    if (!Amq.GLOBALCHANNEL)
      Amq.GLOBALCHANNEL = await this.createChannel()

    return Amq.GLOBALCHANNEL.publish(exchange, routingKey, Buffer.from(JSON.stringify(content)), options)
  }
}

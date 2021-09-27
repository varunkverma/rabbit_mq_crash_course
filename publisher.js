const amqp = require("amqplib");

const msg = {
  number: process.argv[2] || -1,
};

// create a connection to RabbitMQ
async function connect() {
  try {
    // TCP connection
    const connection = await amqp.connect("amqp://localhost:5672");

    // channel
    const channel = await connection.createChannel();

    // publish to a Queue
    // assertQueue makes sure that a queue exists, if not, it creates one
    const result = await channel.assertQueue("jobs");

    // send something on the queue
    channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));

    console.log(`Job send successfully: ${msg.number}`);
  } catch (err) {
    console.error(err);
  }
}

connect();

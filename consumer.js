const amqp = require("amqplib");

// create a connection to RabbitMQ
async function connect() {
  try {
    // TCP connection
    const connection = await amqp.connect("amqp://localhost:5672");

    // channel
    const channel = await connection.createChannel();

    // assertQueue makes sure that a queue exists, if not, it creates one
    const result = await channel.assertQueue("jobs");

    // Unlike cpublisher, we need to keep the consumer alive
    console.log("Waiting for messages...");

    channel.consume("jobs", (message) => {
      const input = JSON.parse(message.content.toString());
      console.log(`Received job with input: ${input.number}`);
      // sending acknowledgement back to the RabbitMQ server
      if (input.number == 7) {
        // intentional
        channel.ack(message);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

connect();

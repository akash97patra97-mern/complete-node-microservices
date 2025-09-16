import amqp from 'amqplib';
import { createAddress } from './addressModel.js';

export const startConsumer = async () => {
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue("address-queue", { durable: true });

    console.log("Address service is waiting for messages...");

    channel.consume("address-queue", async (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());

            console.log("data", data)
            try {
                await createAddress(data.address, data.id);
                channel.ack(msg);
                console.log("Address created successfully");
            } catch (err) {
                console.error("Failed to create address:", err);
            }
        }
    })
}
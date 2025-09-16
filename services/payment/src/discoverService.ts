import amqp from 'amqplib'
import { createPayment } from './paymentModel.js';

export const startConsumer = async()=>{
    const connection = await amqp.connect("amqp://rabbitmq:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue("payment-queue",{durable:true});

    console.log("Payment service is waiting for messages...");

     channel.consume("payment-queue", async (msg) => {
        if (msg) {
            const data = JSON.parse(msg.content.toString());

            console.log("data", data)
            try {
                await createPayment(data.order_id, data.status,data.amount);
                channel.ack(msg);
                console.log("Payment created successfully");
            } catch (err) {
                console.error("Failed to create address:", err);
            }
        }
    })
}
import express from 'express';
import pool from './dbConfig.js';
import { initDB } from './paymentModel.js';
import router from './router.js';
import { errorhandler } from './errorHandler.js';
import axios from 'axios';
import { startConsumer } from './discoverService.js';

const app = express();

const CONSUL_HOST = "http://consul:8500";
const SERVICE_NAME = "payment-service";
const SERVICE_PORT = 5003;

const serviceRegister = async () => {
    try {
        await axios.put(`${CONSUL_HOST}/v1/agent/service/register`, {
            Name: SERVICE_NAME,
            Port: SERVICE_PORT,
            Check: {
                HTTP: `http://product-service:${SERVICE_PORT}/health`,
                Interval: "10s"
            }
        })
        console.log(`${SERVICE_NAME} registered with Consul on port ${SERVICE_PORT}`);
    } catch (error: any) {
        console.error("Failed to register service with Consul", error);
    }
}
//for body parser
app.use(express.json());
pool.connect().then(async () => {
    console.log("Payment DB connected.")
    await initDB();
});

app.use('/api', router)

startConsumer().catch(err => {
  console.error("Failed to start RabbitMQ consumer:", err);
});

app.use(errorhandler)
app.listen(5003, async () => {
    console.log("Payment is connected on 5003.")
    await serviceRegister()
})

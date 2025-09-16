import express from 'express';
import pool from './dbConfig.js';
import { initDB } from './productModel.js';
import router from './router.js';
import { errorhandler } from './errorHandler.js';
import axios from 'axios';

const app = express();

const CONSUL_HOST = "http://consul:8500";
const SERVICE_NAME = "product-service";
const SERVICE_PORT = 5002

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
    console.log("User DB connected.")
    await initDB();
});

app.get('/health', (req, res) => {
    res.status(200).send('Service is healthy');
});

app.use('/api', router)

app.use(errorhandler)
app.listen(5002, async () => { 
    console.log("User is connected on 5002.");
    await serviceRegister(); 
})

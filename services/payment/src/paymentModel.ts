import pool from './dbConfig.js';

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK(status IN('pending','in progress','completed','cancel')),
    amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `)
}

const createPayment = async (
    order_id: number,
    status: string,
    amount: number) => {
    const result = await pool.query(`INSERT INTO payment (order_id,status,amount) VALUES ($1,$2,$3) RETURNING *`, [order_id, status, amount]);

    return result.rows[0]

}

const listAllPayments = async (offset:number, limit:number) => {
    return await pool.query(`SELECT * FROM payment OFFSET $1 LIMIT $2`,[offset,limit]);
}

const findOrderPayment = async (order_id: number) => {
    return await pool.query(`SELECT * FROM payment WHERE order_id = $1`, [order_id]);
}

const updateOrderPayment = async (id: number, field: string, value: string) => {
    const result = await pool.query(`UPDATE users 
    SET ${field}= $1
    WHERE id = $2 RETURNING *`, [value, id])

    return result.rows[0]
}

const cancelPayment = async (order_id: string) => {
    const result = await pool.query(`UPDATE FROM payment 
        SET status = 'cancel' 
        WHERE order_id = $1 RETURNING *`, [order_id])

    return result.rows[0]
}

export { initDB, createPayment, listAllPayments, findOrderPayment, updateOrderPayment, cancelPayment };
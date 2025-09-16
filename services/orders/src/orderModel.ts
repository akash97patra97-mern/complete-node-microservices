import pool from './dbConfig.js';

interface Quantity {
    name: string,
    quantity: number,
    price: number
}

interface Order {
    user_id: number,
    products: Array<Quantity>,
    total_quantity: number,
    total_price: number,
}

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    products JSONB NOT NULL,
    total_quantity INT NOT NULL,
    total_price NUMERIC(10, 2)  NOT NULL
    )
    `)
}

const createOrder = async (order: Order) => {
    const { user_id,
        products,
        total_quantity,
        total_price } = order;

    const result = await pool.query(`INSERT INTO orders (user_id,products,total_quantity,total_price) VALUES ($1,$2,$3,$4) RETURNING *`, [user_id, JSON.stringify(products), total_quantity, total_price]);

    console.log("result from order modal", result)
    return result.rows[0]

}

const listAllOrders = async () => {
    return await pool.query(`SELECT * FROM orders`);
}

const findOrder = async (id: string) => {
    return await pool.query(`SELECT * FROM orders WHERE id = $1`, [id]);
}

const updateOrderField = async (id: number, field: string, value: string) => {
    const result = await pool.query(`UPDATE orders 
    SET ${field}= $1
    WHERE id = $2 RETURNING *`, [value, id])

    return result.rows[0]
}

const deleteOrders = async (id: number) => {
    const result = await pool.query(`DELETE FROM orders 
    WHERE id = $1 RETURNING *`, [id])

    return result.rows[0]
}

export { initDB, createOrder, listAllOrders, findOrder, updateOrderField, deleteOrders };
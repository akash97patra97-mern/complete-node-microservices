import pool from './dbConfig.js';
import bcrypt from 'bcrypt';

interface Product {
    name: string,
    price: number,
    company: string,
    description:string,
    inStock: number,
}

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price FLOAT NOT NULL,
    company VARCHAR(100) NOT NULL,
    description VARCHAR(300) NOT NULL,
    inStock INTEGER NOT NULL
    )
    `)
}

const createProduct = async (name: string,
    price: number,
    company: string,
    description: string,
    inStock: string): Promise<Product> => {
    const result = await pool.query(`INSERT INTO products (name,price,company,description,inStock) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [name, price, company, description, inStock]);

    return result.rows[0]

}

const listAllProducts = async () => {
    return await pool.query(`SELECT * FROM products`);
}

const findProduct = async (id:string) => {
    return await pool.query(`SELECT * FROM products WHERE id = $1`,[id]);
}

const updateProductField = async (id: number, field: string, value: string) => {
    const result = await pool.query(`UPDATE products 
    SET ${field}= $1
    WHERE id = $2 RETURNING *`, [value, id])

    return result.rows[0]
}

const deleteProduct = async (id: number) => {
    const result = await pool.query(`DELETE FROM products 
    WHERE id = $1 RETURNING *`, [id])

    return result.rows[0]
}

export { initDB, createProduct, findProduct, listAllProducts, updateProductField, deleteProduct };
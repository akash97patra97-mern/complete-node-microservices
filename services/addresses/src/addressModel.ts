import pool from './dbConfig.js';

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS address (
    id SERIAL PRIMARY KEY,
    address VARCHAR(200) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
    )
    `)
}

const createAddress = async (address: string, id:number) => {
    const result = await pool.query(`INSERT INTO address (address,user_id) VALUES ($1,$2) RETURNING *`, [address, id]);

    return result.rows[0]

}

const listAllAddresses = async () => {
    return await pool.query(`SELECT * FROM address`);
}

const findAddress = async (id:number) => {
    return await pool.query(`SELECT * FROM address WHERE id = $1`,[id]);
}

const findAllAddressOfUser = async (id:number)=>{
    return await pool.query(`SELECT * FROM address WHERE user_id=$1`,[id])
}

const updateUserAddress = async (id: number, address: string) => {
    const result = await pool.query(`UPDATE address 
    SET address= $1
    WHERE id = $2 RETURNING *`, [address, id])

    return result.rows[0]
}

const deleteAddress = async (id: number) => {
    const result = await pool.query(`DELETE FROM users 
    WHERE email = $1 RETURNING *`, [id])

    return result.rows[0]
}

export { initDB, createAddress, listAllAddresses, findAddress,deleteAddress, findAllAddressOfUser, updateUserAddress };
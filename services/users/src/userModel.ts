import pool from './dbConfig.js';
import bcrypt from 'bcrypt';

interface User {
    id:number,
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string
}

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(300) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin')),
    phone VARCHAR(100) NOT NULL
    )
    `)
}

const createUser = async (name:string, email:string, password:string, phone:string): Promise<User> => {
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await pool.query(`INSERT INTO users (name,email,password,phone) VALUES ($1,$2,$3,$4) RETURNING *`, [name, email, hashedPassword, phone]);

     return result.rows[0]

}

// const createUser = async (data: User): Promise<User> => {
//     const hashedPassword = await bcrypt.hash(data.password, 10)
//     const result = await prisma.user.create(
//         {
//             data:{
//                 name: data.name,
//                 email: data.email,
//                 password: hashedPassword,
//                 role: data.role,
//                 phone: data.phone
//             }
//         }
//     )

//     return result;
// }

const listAllUsers = async (offset:number,limit:number) => {
    return await pool.query(`SELECT * FROM users OFFSET $1 LIMIT $2`,[offset,limit]);
}

const findUser = async (id:string) => {
    return await pool.query(`SELECT * FROM users WHERE id = $1`,[id]);
}

const updateUserField = async (id: number, field: string, value: string) => {
    const result = await pool.query(`UPDATE users 
    SET ${field}= $1
    WHERE id = $2 RETURNING *`, [value, id])

    return result.rows[0]
}

const deleteUsers = async (email: string) => {
    const result = await pool.query(`DELETE FROM users 
    WHERE email = $1 RETURNING *`, [email])

    return result.rows[0]
}

export { 
    initDB, 
    createUser, 
    listAllUsers, 
    updateUserField,
    deleteUsers, 
    findUser 
};
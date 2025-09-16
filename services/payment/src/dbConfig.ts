import {Pool} from 'pg';

const pool = new Pool({
    user:'postgres',
    password:'akash',
    port:5432,
    database:'postgres',
    host:'postgres'
})

export default pool;
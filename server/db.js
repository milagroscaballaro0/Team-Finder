import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "10.1.0.18",     
  user: "teamuser",       
  password: "Abc123!!", 
  database: "Team-Finder", 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

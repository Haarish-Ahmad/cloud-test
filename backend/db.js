const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        console.log(err);
        return;
    }
    console.log("Connected to MySQL");

    //AUTO-BOOTSTRAP TABLES IF THEY DON'T EXIST
    const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            stock INT NOT NULL
        );
    `;

    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            customer_name VARCHAR(255) NOT NULL
        );
    `;

    connection.query(createProductsTable, (err) => {
        if (err) console.error("Error initializing products table:", err);
        else console.log("Products table verified/created.");
    });

    connection.query(createOrdersTable, (err) => {
        if (err) console.error("Error initializing orders table:", err);
        else console.log("Orders table verified/created.");
    });
});

module.exports = connection;

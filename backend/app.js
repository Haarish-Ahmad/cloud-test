const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
	res.send("Backend is running");
});



app.post("/api/products", (req,res) => {
	const { name, price, stock } = req.body;
	const sql = "INSERT INTO products (name, price, stock) VALUES (?, ?, ?)";

	db.query(sql, [name, price, stock], (err, result) => {

		if (err) {
			return res.status(500).json(err);
		}

		res.status(201).json({
			message: "Product added succesfully"
		});
	});
});


app.get("/api/products", (req,res) => {
	const sql = "SELECT * FROM products;"

	db.query(sql, (err, results) => {

		if (err) {
			return res.status(500).json(err);
		}
		res.json(results);
	});
});


app.post("/api/orders", (req,res) => {
        const { product_id,  quantity, customer_name } = req.body;
        const sql = "INSERT INTO orders (product_id, quantity, customer_name) VALUES (?, ?, ?)";

        db.query(sql, [product_id, quantity, customer_name], (err, result) => {

                if (err) {
                        return res.status(500).json(err);
                }

                res.status(201).json({
                        message: "Orders added succesfully"
                });
        });
});


app.get("/api/orders", (req,res) => {
        const sql = "SELECT * FROM orders;"

        db.query(sql, (err, results) => {

                if (err) {
                        return res.status(500).json(err);
                }
                res.json(results);
        });
});



app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});



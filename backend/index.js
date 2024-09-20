const express=require('express');
require('dotenv').config();
const Razorpay = require('razorpay');
// console.log(process.env.DB_PASS);
// console.log(process.env.DB_USER);
const con=require('./db/config');

const app=express();

const cors=require('cors');
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('welcome to node backend of hamari laado ')
});

app.post('/add-user', (req, res) => {
    let data = req.body;


    // Insert data into the hl_users table
    con.query('INSERT INTO hl_users SET ?', data, (err, result) => {
        if (err) {
            // Handle error
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        // Success response
        //res.status(200).send(result);
        res.status(200).send({ regno: result.insertId });

    });
});

app.post('/update-pan', (req, res) => {
    let { pan, regno } = req.body.paymentDetails; // Extract PAN and regno from the request body

    // Ensure that both pan and regno are provided
    if (!pan || !regno) {
        return res.status(400).send('PAN and regno are required');
    }

    // Update PAN for the user with the given regno
    const query = 'UPDATE hl_users SET pan = ? WHERE regno = ?';

    con.query(query, [pan, regno], (err, result) => {
        if (err) {
            // Handle error
            console.error('Error updating PAN:', err);
            return res.status(500).send('Error updating PAN');
        }

        if (result.affectedRows === 0) {
            // If no rows were updated, the regno might not exist
            return res.status(404).send('User with the given regno not found');
        }

        // Success response
        res.status(200).send({ success: 'success' });
    });
});

app.post('/add-user-old',(req,res)=>{
    let data=req.body;
    con.query('insert into hl_users set ?',data,(err,result,field)=>{
        res.send(result);
    })
    res.send(data);
});

app.get('/show-users', (req, res) => {
    // Query to select all users
    con.query('SELECT * FROM hl_users', (err, results) => {
        if (err) {
            // Handle error
            console.error('Error retrieving users:', err);
            return res.status(500).send('Error retrieving users');
        }
        // Success response
        res.status(200).json(results);
    });
});

//  Payment gateway integration 
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.post('/create-order', async (req, res) => {
    const { amount } = req.body; // Get amount from request body

    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).send('Invalid amount');
    }
    const options = {
        amount: amount,
        currency: "INR",
        receipt: "order_rcptid_11"
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).send('Something went wrong');
    }
});




app.post('/update-payment-details', (req, res) => {
    const { name, email, contact, amount, order_id, regno } = req.body;

    if (!name || !email || !amount || !order_id || !contact || !regno) {
        return res.status(400).send('All fields are required');
    }

    const query = `
        INSERT INTO payments (order_id, name, email, contact, amount, regno)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            email = VALUES(email),
            contact = VALUES(contact),
            amount = VALUES(amount),
            regno = VALUES(regno),
            updated_at = CURRENT_TIMESTAMP
    `;
    console.log('inside update payments details API');
    
    // Make sure all six values are passed into con.query
    con.query(query, [order_id, name, email, contact, amount, regno], (err, results) => {
        if (err) {
            console.error('Error inserting/updating payment details:', err);
            return res.status(500).send('Database error');
        }
        res.send('Payment details updated successfully');
    });
});


const { createHmac } = require('node:crypto');
app.post('/verify-payment', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).send('All fields are required');
    }

    // Prepare the data for signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    let payment_status = isAuthentic ? 'completed' : 'failed';

    // Update payment status in the database
    const query = `
        UPDATE payments
        SET payment_id = ?, payment_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ?
    `;

    con.query(query, [razorpay_payment_id, payment_status, razorpay_order_id], (err, results) => {
        if (err) {
            console.error('Error updating payment status:', err);
            return res.status(500).send('Database error');
        }

        res.send({ status: payment_status });
    });
});



app.get('/payments', (req, res) => {
    const query = 'SELECT * FROM payments';

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching payment records:', err);
            return res.status(500).send('Database error');
        }
       
        res.json(results);
    });
});

app.get('/users', (req, res) => {
    const query = 'SELECT * FROM hl_users';

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users records:', err);
            return res.status(500).send('Database error');
        }
       
        res.json(results);
    });
});

app.listen(process.env.PORT, () => {
  console.log('Server is running ');
});

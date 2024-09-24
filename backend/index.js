const express=require('express');
require('dotenv').config();
const Razorpay = require('razorpay');
// console.log(process.env.DB_PASS);
// console.log(process.env.DB_USER);
const con=require('./db/config');
const crypto = require('crypto');
const moment = require('moment-timezone'); // You'll need to install this library: npm install moment-timezone

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
    con.query('SELECT * FROM hl_users ORDER BY regno', (err, results) => {
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

moment.tz.setDefault("Asia/Kolkata"); 
// Calculate timestamps
const fromTimestamp = moment.tz("2024-09-20 00:00:00", "Asia/Kolkata").unix();
const toTimestamp = moment.tz("2024-09-24 23:59:59", "Asia/Kolkata").unix();

console.log(fromTimestamp); // Output: 1695167400
console.log(toTimestamp);   // Output: 1695513599
reconcilePayments(fromTimestamp, toTimestamp);


app.get('/payments', (req, res) => {
    const query = 'SELECT * FROM payments ORDER BY regno';

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching payment records:', err);
            return res.status(500).send('Database error');
        }
       
        res.json(results);
    });
});

// Endpoint to handle Razorpay webhooks
app.post('/razorpay-webhook', async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body;

    // Verify signature (IMPORTANT for security)
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(JSON.stringify(body))
        .digest('hex');

    if (signature !== generated_signature) {
        console.error('Webhook signature mismatch');
        return res.status(400).send('Invalid signature');
    }

    const webhookEvent = body.event;

    try {
        // Process the webhook event
        switch (webhookEvent) {
            case 'payment.captured':
                await processPaymentCaptured(body.payload.payment);
                break;
            case 'payment.failed':
                await processPaymentFailed(body.payload.payment);
                break;
            // Handle other events as needed
            default:
                console.log('Unhandled webhook event:', webhookEvent);
        }

        res.status(200).send('Webhook processed successfully');

    } catch (error) {
        // ... (error handling and retry logic)
    }
});

async function processPaymentCaptured(paymentData) {
    const orderId = paymentData.order_id;
    const paymentId = paymentData.id;

    // Check for idempotency (optional, but recommended)
    // ... (You might want to check if this payment has already been processed)

    // Update your database 
    const query = `
        UPDATE payments
        SET payment_id = ?, payment_status = 'completed', updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ?
    `;

    con.query(query, [paymentId, orderId], (err, results) => {
        if (err) {
            console.error('Error updating payment status in webhook:', err);
            // Handle the error appropriately (e.g., retry, log, notify)
        } else {
            console.log('Payment status updated successfully in webhook');
        }
    });
}

// Function to process a payment.failed event
async function processPaymentFailed(paymentData) {
    const orderId = paymentData.order_id;
    const paymentId = paymentData.id; 

    // Update your database to reflect the failed payment
    const query = `
        UPDATE payments
        SET payment_id = ?, payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE order_id = ?
    `;

    con.query(query, [paymentId, orderId], (err, results) => {
        if (err) {
            console.error('Error updating payment status in webhook (failed):', err);
            // Handle the error appropriately (e.g., retry, log, notify)
        } else {
            console.log('Payment status updated to failed in webhook');
        }
    });

}

async function reconcilePayments(from, to) {
    try {
        const paymentsData = await fetchPaymentsFromRazorpay(from, to);

        for (const payment of paymentsData) {
            const orderId = payment.id;
            const paymentId = payment.attributes.payments[0].id;
            const paymentStatus = payment.attributes.status;

            const isPaymentInDatabase = await checkIfPaymentExists(orderId);

            if (!isPaymentInDatabase) {
                await insertPaymentIntoDatabase(orderId, paymentId, paymentStatus);
            } else {
                const currentStatusInDatabase = await getPaymentStatusFromDatabase(orderId);
                if (currentStatusInDatabase !== paymentStatus) {
                    await updatePaymentStatusInDatabase(orderId, paymentStatus);
                }
            }
        }

        console.log('Payment reconciliation completed successfully');
    } catch (error) {
        console.error('Error during payment reconciliation:', error);
    }
}

async function fetchPaymentsFromRazorpay(from, to) {
    try {
        const response = await razorpay.orders.all({
            from: from,
            to: to
        });

        return response.items;
    } catch (error) {
        console.error('Error fetching payments from Razorpay:', error);
        throw error;
    }
}

// Database helper functions

async function checkIfPaymentExists(orderId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) as count FROM payments WHERE order_id = ?';
        con.query(query, [orderId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0].count > 0); // Resolve true if count is greater than 0
            }
        });
    });
}

async function insertPaymentIntoDatabase(orderId, paymentId, paymentStatus) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO payments (order_id, payment_id, payment_status) VALUES (?, ?, ?)';
        con.query(query, [orderId, paymentId, paymentStatus], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results); 
            }
        });
    });
}

async function getPaymentStatusFromDatabase(orderId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT payment_status FROM payments WHERE order_id = ?';
        con.query(query, [orderId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length > 0 ? results[0].payment_status : null); 
            }
        });
    });
}

async function updatePaymentStatusInDatabase(orderId, paymentStatus) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE payments SET payment_status = ? WHERE order_id = ?';
        con.query(query, [paymentStatus, orderId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

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

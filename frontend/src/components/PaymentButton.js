import React, { useState } from 'react';

function PaymentButton() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [amount1, setAmount] = useState('');
    const [err, setErr] = useState(false);

    const handlePayment = async () => {
        // Basic validation
        if (!name || !email || !contact || !amount1) {
            setErr(true);
            return;
        }
        const order_url=`${process.env.REACT_APP_API_URL}/create-order`
        
        const res = await fetch(order_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amount1 * 100 }) // Convert to paise
        });
        const data = await res.json();
        console.log(data);

        if (!data.id) {
            alert('Failed to create order');
            return;
        }

        // Store payment details in the database
        const paymentDetailsUrl = `${process.env.REACT_APP_API_URL}/update-payment-details`;
        await fetch(paymentDetailsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_id: data.id,
                name: name,
                email: email,
                amount: amount1,
                contact:contact
                
            })
        });


        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add this in your .env file
            amount: data.amount,
            currency: data.currency,
            name: "Hamari Laado Foundation",
            description: "Test Transaction",
            image: "https://hamarilaado.org/media/website/Hamari-Laado-2.png", // optional
            order_id: data.id,
            handler: async function (response) {

               

                alert(`Payment ID: ${response.razorpay_payment_id}`);
                // alert(`Order ID: ${response.razorpay_order_id}`);
                // alert(`Signature: ${response.razorpay_signature}`);


                // Verify payment
                const verifyPaymentUrl = `${process.env.REACT_APP_API_URL}/verify-payment`;
                await fetch(verifyPaymentUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })
                });
            },
            prefill: {
                name: name,
                email: email,
                contact: contact,
            },
            notes: {
                address: ""
            },
            theme: {
                color: "#3399cc"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    return (
        <div className="payment">
            <h1>Make a Payment</h1>
            <input
                onChange={(e) => { setName(e.target.value); }}
                value={name}
                className="inputBox"
                type="text"
                placeholder="Enter Name"
            />
            {err && !name && <span className="invalid-input">Enter a valid name</span>}
            
            <input
                onChange={(e) => { setEmail(e.target.value); }}
                value={email}
                className="inputBox"
                type="text"
                placeholder="Enter Email"
            />
            {err && !email && <span className="invalid-input">Enter a valid email</span>}
            
            <input
                onChange={(e) => { setContact(e.target.value); }}
                value={contact}
                className="inputBox"
                type="text"
                placeholder="Enter Contact"
            />
            {err && !contact && <span className="invalid-input">Enter a valid contact</span>}
            
            <input
                onChange={(e) => { setAmount(e.target.value); }}
                value={amount1}
                className="inputBox"
                type="text"
                placeholder="Enter Amount"
            />
            {err && !amount1 && <span className="invalid-input">Enter a valid amount</span>}
            
            <button className="appButton" onClick={handlePayment}>Pay with Razorpay</button>
        </div>
    );
}

export default PaymentButton;

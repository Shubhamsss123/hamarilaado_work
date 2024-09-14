import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddUser.css';
import headerImage from '../resources/header.png';

const AddUser = () => {
    const [err, setErr] = useState(false);
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [consent, setConsent] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [mode, setMode] = useState('');
    const [selectedTile, setSelectedTile] = useState(null); // State to track the selected button
    const [consentChecked, setConsentChecked] = useState(false); // State for the checkbox
    const navigate = useNavigate();

    const handleConsentChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    // Handlers for selecting options and triggering payment
    const registerFor5K = () => {
        setSelectedTile('option1');
        addUser(0); // No payment for 5K registration
    };

    const donateShoes = () => {
        setSelectedTile('option2');
        addUser(700); // Payment for shoes donation
    };

    const donateGroupShoes = () => {
        setSelectedTile('option3');
        addUser(21000); // Payment for group shoes donation
    };

    // Payment Handler
    const handlePayment = async (amount) => {
        const paymentDetails = {
            name: name,
            email: email,
            contact: phone,
            amount1: amount
        };

        try {
            const paymentResponse = await processPayment(paymentDetails);  // Call processPayment here
            alert(paymentResponse); // Show payment success message
            navigate('/');
        } catch (paymentError) {
            alert(paymentError); // Show payment failure message
        }
    };

    const addUser = async (amount) => {
        let local_err = false;

        if (!name || !email || !gender || !phone || !city || !state || !country || !mode || !number || !consent || !selectedTile) {
            setErr(true);
            local_err = true;
        } else {
            setErr(false);
        }

        if (!local_err) {
            let result = await fetch('https://girls5k.org/api/add-user', {
                method: "post",
                body: JSON.stringify({ number, name, email, gender, consent, phone, city, state, country, mode }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            result = await result.json();

            if (result) {
                // Proceed with payment after successful form submission
                try {
                    await handlePayment(amount);  // Call handlePayment with the correct amount
                    alert('Registration and payment successful!');
                    navigate('/');
                } catch (paymentError) {
                    alert(paymentError); // Show payment failure message
                }
            }
        }
    };

    return (
        <div className="user">
            <div className="image-container">
                <img src={headerImage} alt="Large background" className="background-image" />
                <div className="overlay-header">
                    <h1>Register for 5K Run</h1>
                </div>
            </div>
            <div className="headertext">
                <p>Hamari Laado invites donations for our MARG, NEEV, Giving Circle, and team programs...</p>
            </div>
            <div className="userform">
                <input onChange={(e) => setNumber(e.target.value)} value={number} className="inputBox" type="text" placeholder="Enter number" />
                {err && !number && <span className="invalid-input">Enter valid number</span>}

                <input onChange={(e) => setName(e.target.value)} value={name} className="inputBox" type="text" placeholder="Enter Name" />
                {err && !name && <span className="invalid-input">Enter valid name</span>}

                <input onChange={(e) => setEmail(e.target.value)} value={email} className="inputBox" type="text" placeholder="Enter Email" />
                {err && !email && <span className="invalid-input">Enter valid email</span>}

                <select className="inputBox" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                </select>
                {err && !gender && <span className="invalid-input">Enter valid gender</span>}

                <input onChange={(e) => setPhone(e.target.value)} value={phone} className="inputBox" type="text" placeholder="Enter Phone" />
                {err && !phone && <span className="invalid-input">Enter valid phone</span>}

                <input onChange={(e) => setCity(e.target.value)} value={city} className="inputBox" type="text" placeholder="Enter City" />
                {err && !city && <span className="invalid-input">Enter valid city</span>}

                <input onChange={(e) => setState(e.target.value)} value={state} className="inputBox" type="text" placeholder="Enter State" />
                {err && !state && <span className="invalid-input">Enter valid state</span>}

                <input onChange={(e) => setCountry(e.target.value)} value={country} className="inputBox" type="text" placeholder="Enter Country" />
                {err && !country && <span className="invalid-input">Enter valid country</span>}

                <select className="inputBox" value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="">Select Mode</option>
                    <option value="in_person">In Person</option>
                    <option value="online">Online</option>
                </select>
                {err && !mode && <span className="invalid-input">Enter valid mode</span>}

                <div className="consent-section">
                    <input type="checkbox" id="consent" checked={consentChecked} onChange={handleConsentChange} />
                    <label htmlFor="consent">I agree to the <a href="/terms" target="_blank">Terms and Conditions</a></label>
                </div>

                <div className="tile-container">
                    <button className={`tile-button ${selectedTile === 'option1' ? 'selected' : ''}`} onClick={registerFor5K}>
                        <h3>Register</h3>
                        <p>Register for 5K run/walk only</p>
                    </button>

                    <button className={`tile-button ${selectedTile === 'option2' ? 'selected' : ''}`} onClick={donateShoes}>
                        <h3>Register and Donate a pair of Shoes</h3>
                        <p>INR 700</p>
                    </button>

                    <button className={`tile-button ${selectedTile === 'option3' ? 'selected' : ''}`} onClick={donateGroupShoes}>
                        <h3>Register and Donate Shoes for a Group of 30 Girls</h3>
                        <p>INR 21,000</p>
                    </button>
                </div>

                {/* <button className="appButton" onClick={addUser}>Register</button> */}
            </div>
        </div>
    );
};

// Payment Processing Logic
const processPayment = async (paymentDetails) => {
    const { name, email, amount1, contact } = paymentDetails; // Destructure paymentDetails
    const order_url = `https://girls5k.org/api/create-order`;

    const res = await fetch(order_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount1 * 100 }) // Convert to paise
    });
    const data = await res.json();

    if (!data.id) {
        alert('Failed to create order');
        return;
    }

    // Store payment details in the database
    // const paymentDetailsUrl = `${process.env.REACT_APP_API_URL}/update-payment-details`;
    const paymentDetailsUrl = `https://girls5k.org/api/update-payment-details`;

   
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
            contact: contact
        })
    });

    const options = {
        // key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add this in your .env file
        key:'rzp_test_2dgEk0z8Myw5Rm',
        amount: data.amount,
        currency: data.currency,
        name: "Hamari Laado Foundation",
        description: "Registration Payment",
        image: "https://hamarilaado.org/media/website/Hamari-Laado-2.png",
        order_id: data.id,
        handler: async function (response) {
            alert(`Payment ID: ${response.razorpay_payment_id}`);

            // Verify payment
            const verifyPaymentUrl = ` https://girls5k.org/api/verify-payment`;
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
        },
        theme: {
            color: "#3399cc"
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
}

export default AddUser;

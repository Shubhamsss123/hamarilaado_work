import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddUser.css';
import headerImage from '../resources/header.png';

const AddUser = () => {
    const [err, setErr] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    // const [consent, setConsent] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [mode, setMode] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);  // New state for button click
    const [consentChecked, setConsentChecked] = useState(false);
    const [isUserAdded, setIsUserAdded] = useState(false); // Track if the user is added
    const [showModal, setShowModal] = useState(false);     // Control the modal visibility
    const [regNo, setRegNo] = useState(null); // State to hold the userId



    const navigate = useNavigate();

    const handleConsentChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    // // Handle button clicks
    // const handleButtonClick = (option) => {
    //     setSelectedOption(option);
    //     addUser(option);  // Call addUser with the selected option
    // };

    const handlePayment = async (amount) => {
        const paymentDetails = {
            name: name,
            email: email,
            contact: phone,
            amount1: amount
        };

        try {
            console.log('Payment Details:', paymentDetails); // Debug payment details
            const paymentResponse = await processPayment(paymentDetails);
            console.log('Payment Response:', paymentResponse); // Debug payment response
            navigate('/');
        } catch (paymentError) {
            console.error('Payment Error:', paymentError); // Log payment error
        }
    };

    const addUser = async (option) => {
        let local_err = false;

        if (!name || !email || !gender || !phone || !city || !state || !country || !mode || !consentChecked) {
            setErr(true);
            local_err = true;
        } else {
            setErr(false);
        }

        if (!local_err) {
            try {
                const result = await fetch('https://girls5k.org/api/add-user', {
                    method: "POST",
                    body: JSON.stringify({name, email, gender, phone, city, state, country, mode }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const resultData = await result.json();
                console.log('Add User Result:', resultData); // Debug add user result

                // After successful user registration, check the option and handle payment
                if (resultData && resultData.regno) {
                    setRegNo(resultData.regno);
                    setIsUserAdded(true);  // Set state to indicate user is added
                    setShowModal(true);     // Open the modal after adding user
                }
            } 
            catch (error) {
                console.error('Add User Error:', error); // Log add user error
                alert('User registration failed. Please try again.');
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
                </div><br/><br/>
                {err && !consentChecked && <span className="invalid-input">Please accept the terms and conditions</span>}


                {
                    showModal && (
                        <>
                            <div className="modal-overlay"></div> 

                            <div className="modal">
                                <center><h2>Thank you!!!</h2></center>
                                <button className="close-button" onClick={() => {
                                    setShowModal(false);
                                    document.body.classList.remove('modal-open');  // Remove class when closing modal
                                    window.location.href='https://hamarilaado.org/'
                                }}>×</button>
                                <h4>Your Registration is complete!!!! </h4>
                                <br/>
                                <h4>Your Registration Number is {regNo}. You will receive a mail with your bib. You can use that for your run.</h4>
                                <br/><br/>
                                <h5>Would you also like to donate for the run? Else press "Close" to go back to the main site</h5>

                                <h5>Select Donation Option</h5>
                                <button onClick={() => handlePayment(700)}>
                                    Donate a pair of Shoes (INR 700)
                                </button>
                                <button onClick={() => handlePayment(21000)}>
                                    Donate Shoes for a Group of 30 Girls (INR 21,000)
                                </button>
                                <button onClick={() => {
                                    setShowModal(false);
                                    document.body.classList.remove('modal-open');  // Remove class when closing modal
                                    window.location.href='https://hamarilaado.org/'
                                }}>Close</button>

                            </div>
                        </>
                    )
                }

               
                <button className="appButton" onClick={addUser}>Register</button>

            </div>
        </div>
    );
};

// Payment Processing Logic
const processPayment = async (paymentDetails) => {
    const { name, email, amount1, contact } = paymentDetails;
    const order_url = `https://girls5k.org/api/create-order`;

    try {
        const res = await fetch(order_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: amount1 * 100 }) // Convert to paise
        });

        const data = await res.json();
        console.log('Order Creation Response:', data); // Debug order creation response

        if (!data.id) {
            throw new Error('Failed to create order');
        }

        // Store payment details in the database
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
            key: 'rzp_test_2dgEk0z8Myw5Rm',
            amount: data.amount,
            currency: data.currency,
            name: "Hamari Laado Foundation",
            description: "Registration Payment",
            image: "https://hamarilaado.org/media/website/Hamari-Laado-2.png",
            order_id: data.id,
            handler: async function (response) {
                console.log('Payment Response:', response); // Debug payment response
                const verifyPaymentUrl = `https://girls5k.org/api/verify-payment`;

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
    } catch (error) {
        console.error('Process Payment Error:', error); // Log process payment error
        throw error;
    }
};

export default AddUser;

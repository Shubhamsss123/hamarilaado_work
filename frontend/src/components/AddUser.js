import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AddUser.css';
import headerImage from '../resources/header.png';
import donateImage from '../resources/donate.jpg';

const AddUser = () => {
    const [err2, setErr2] = useState(false);
    const [err, setErr] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [pan, setPan] = useState('');
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);  // New state for button click
    const [consentChecked, setConsentChecked] = useState(false);
    const [isUserAdded, setIsUserAdded] = useState(false); // Track if the user is added
    const [showModal, setShowModal] = useState(false);     // Control the modal visibility
    const [regNo, setRegNo] = useState(null); // State to hold the userId
    const [showPanInput, setShowPanInput] = useState(false); // Track whether to show PAN input
    const [isAmountDisabled, setIsAmountDisabled] = useState(true); // Track if amount input should be disabled


    const navigate = useNavigate();

    const handleConsentChange = (e) => {
        setConsentChecked(e.target.checked);
    };

    // // Handle button clicks
    // const handleButtonClick = (option) => {
    //     setSelectedOption(option);
    //     addUser(option);  // Call addUser with the selected option
    // };

    const handlePayment = async (pan, amount) => {
        const paymentDetails = {
            name: name,
            email: email,
            contact: phone,
            pan : pan,
            regno: regNo,
            amount1: amount
        };

        let local_err2 = false;

        try {

            if (!pan || !amount) {
                setErr2(true);
                local_err2 = true;
            } 
            else if (!Number.isInteger(Number(amount))) {
                setErr2(true);
                local_err2 = true;
            } 
            else {
                setErr2(false);
                setShowPanInput(false);
            }
    
            const result = await fetch('https://girls5k.org/api/update-pan', {
                method: "POST",
                body: JSON.stringify({paymentDetails}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resultData = await result.json();
            console.log('Add User Result:', resultData); // Debug add user result

            // After successful user registration, check the option and handle payment
            if (resultData) {
                const paymentResponse = await processPayment(paymentDetails);
                console.log('Payment Response:', paymentResponse); // Debug payment response
                navigate('/');
                console.log('Payment Details:', paymentDetails); // Debug payment details

    
            }
        } 
        catch (paymentError) {
            console.error('Payment Error:', paymentError); // Log payment error
        }

        
    };

    const addUser = async (option) => {
        let local_err = false;
        let event_no = '6'
        let event_date = "2024-10-11"

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
                    body: JSON.stringify({name, email, gender, phone, city, state, country, mode, event_no, event_date }),
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
                    <h2>LADKIYA BHAGE SABSE AAGE</h2>
                    <h1>5K RUN</h1>
                    <br/><br/><br/>
                    <h2>11th October</h2>
                    <h2>International Day of The Girl</h2>
                    <br/><br/><br/>

                    <h1>Register Below!</h1>
                </div>
            </div>
            <div className="headertext">
                <p>Join the movement - to celebrate the girls and be a bridge for them! 
The LBSA 5K is an exciting 5-kilometer run that celebrates the amazing journey of rural girls in grades 5-8 who are a part of Hamari Laado’s NEEV program. On this International Day of The Girl, hundreds of girls will be concluding their 10-week NEEV program with a 5 kilometer run! This run is a place for them to feel accomplished and show off their learnings, hard work, and determination. Each step they take is a proud moment, reminding them that they can achieve anything they set their minds to.</p>

<p>We invite you to be part of this inspiring event! Whether you run/walk in your local community or support a school participating in the NEEV program, your involvement helps motivate more girls to reach for their dreams. So, lace up your shoes and join us for the NEEV 5K!
</p>
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
                    <option value="in_person">In-Person, with NEEV girls</option>
                    <option value="online">From my location</option>
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
                            <center><h2>Thank you!</h2></center>
                            <button className="close-button" onClick={() => {
                                setShowModal(false);
                                document.body.classList.remove('modal-open');  // Remove class when closing modal
                                window.location.href='https://hamarilaado.org/'
                            }}>×</button>

                           <center> <img src={donateImage} alt="Large background" className="small-image"/></center>

                            <p>Your Registration is complete! </p>
                            <p>Thank you for taking this step in making a difference! Your Registration Number is {regNo}. You will receive a confirmation email and your Bib within 48 hours. We look forward to seeing you sweat and smile on October 11th!</p>
                            <p>Would you like your impact to last longer? Donate below:</p>
                            <div className="donateButtons-div">
                                <button className="donateButton" onClick={() => {
                                    setPan('');
                                    setAmount(700);
                                    setIsAmountDisabled(true); 
                                    setShowPanInput(true); // Hide PAN input when selecting a fixed donation
                                }}>
                                    Donate a pair of Shoes (INR 700)
                                </button>
                                <button className="donateButton" onClick={() => {
                                    setPan('');
                                    setAmount(15000);
                                    setIsAmountDisabled(true); 
                                    setShowPanInput(true); // Hide PAN input when selecting a fixed donation
                                }}>
                                    Donate a Run (INR 15,000)
                                </button>
                                <button className="donateButton" onClick={() => {
                                    setPan('');
                                    setAmount(''); // Clear the amount
                                    setIsAmountDisabled(false); 
                                    setShowPanInput(true); // Show PAN input for custom donation
                                }}>
                                    Donate any other amount
                                </button>
                            </div>

                            {showPanInput && (
                                <div classname = "showPan">
                                    <center><input onChange={(e) => setPan(e.target.value)} value={pan} className="inputBox" type="text" placeholder="Enter PAN No" />
                                    {err2 && !pan && <span className="invalid-input">Enter a PAN</span>}
                                    <input 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        value={amount} 
                                        className="inputBox" 
                                        type="text" 
                                        placeholder="Enter Amount" 
                                        disabled={isAmountDisabled}  // Disable the field if a fixed amount is selected
                                    />
                                    {err2 && !amount && <span className="invalid-input">Enter an Amount</span>}

                                    <button className="paymentButton" onClick={() => {
                                        setPan('');
                                        setAmount(15000);
                                        setIsAmountDisabled(true); 
                                        handlePayment(pan, amount)
                                    }
                                    }>
                                        Proceed and Pay
                                    </button></center>
                                </div>
                            )}
                            <p>Press ‘close’ to go back to the main site!</p>                            
                            <p>Per Govt norms, donations accepted from Indian bank account only</p> 

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
    const { name, email, amount1, contact, regno } = paymentDetails;
    const order_url = `https://girls5k.org/api/create-order`;
    console.log(regno);
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
                contact: contact,
                regno: regno
            })
        });

        const options = {
            key: 'rzp_live_KCfsj4AX7KGUbh',
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

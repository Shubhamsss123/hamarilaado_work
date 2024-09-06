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

    const handleConsentChange = (e) => {
        setConsentChecked(e.target.checked);
    };
    const navigate = useNavigate();
    // console.log(`the razorpay id si ${process.env.REACT_APP_RAZORPAY_KEY_ID}`);

    const handleTileSelect = (tile) => {
        setSelectedTile(tile); // Set the selected tile
    };

    const addUser = async () => {
        
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
                body: JSON.stringify({ number,name, email, gender,consent, phone, city, state, country, mode }),
                headers: {
                    'Content-Type': 'application/json',
                 
                }
            });
            result = await result.json();

          
            // console.log(result);
            if(result){navigate('/');}
           
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
                <p>Hamari Laado invites donations for our MARG, NEEV, Giving Circle, and team programs that positively impact rural and low income girls.</p>
                <p>If you would like to take the NEEV program to a low income school in a village or in your neighborhood, become a sponsor by Adopting A School !</p>
                <p>A sponsorship to first generation talented rural girls goes a long way in building confidence and new norms in their families and communities about what girls can  achieve.</p>
            </div>
            <div className="userform">
            <input
                onChange={(e) => { setNumber(e.target.value); }}
                value={number}
                className="inputBox"
                type="text"
                placeholder="Enter number"
            />
                {err && !number && <span className="invalid-input">Enter valid number</span>}
            <input
                onChange={(e) => { setName(e.target.value); }}
                value={name}
                className="inputBox"
                type="text"
                placeholder="Enter Name"
            />
            {err && !name && <span className="invalid-input">Enter valid name</span>}
            <input
                onChange={(e) => { setEmail(e.target.value); }}
                value={email}
                className="inputBox"
                type="text"
                placeholder="Enter Email"
            />
            {err && !email && <span className="invalid-input">Enter valid email</span>}
            <select
                className="inputBox"
                value={gender}
                onChange={(e) => setMode(e.target.value)}
            >
                <option value="">Select Gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>

            </select>
            {err && !gender && <span className="invalid-input">Enter valid mode</span>}
            <input
                onChange={(e) => { setPhone(e.target.value); }}
                value={phone}
                className="inputBox"
                type="text"
                placeholder="Enter Phone"
            />
            {err && !phone && <span className="invalid-input">Enter valid phone</span>}
            
            <input
                onChange={(e) => { setCity(e.target.value); }}
                value={city}
                className="inputBox"
                type="text"
                placeholder="Enter City"
            />
            {err && !city && <span className="invalid-input">Enter valid city</span>}
            <input
                onChange={(e) => { setState(e.target.value); }}
                value={state}
                className="inputBox"
                type="text"
                placeholder="Enter State"
            />
            {err && !state && <span className="invalid-input">Enter valid state</span>}
            <input
                onChange={(e) => { setCountry(e.target.value); }}
                value={country}
                className="inputBox"
                type="text"
                placeholder="Enter Country"
            />
            {err && !country && <span className="invalid-input">Enter valid country</span>}
            <select
                className="inputBox"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
            >
                <option value="">Select Mode</option>
                <option value="in_person">In Person</option>
                <option value="online">Online</option>
            </select>
            {err && !mode && <span className="invalid-input">Enter valid mode</span>}
            
            {/* Consent Section */}
            <div className="consent-section">
                <input
                    type="checkbox"
                    id="consent"
                    checked={consentChecked}
                    onChange={handleConsentChange}
                />
                <label htmlFor="consent">
                    I agree to the <a href="/terms" target="_blank">Terms and Conditions</a>
                </label>
            </div>
            <div className="tile-container">
                <button
                    className={`tile-button ${selectedTile === 'option1' ? 'selected' : ''}`}
                    onClick={() => handleTileSelect('option1')}
                >
                    <h3>Register</h3>
                    <p>Register for 5K run/walk only</p>
                </button>

                <button
                    className={`tile-button ${selectedTile === 'option2' ? 'selected' : ''}`}
                    onClick={() => handleTileSelect('option2')}
                >
                    <h3>Register and Donate a pair of Shoes</h3>
                    <p>INR 700</p>
                </button>

                <button
                    className={`tile-button ${selectedTile === 'option3' ? 'selected' : ''}`}
                    onClick={() => handleTileSelect('option3')}
                >
                     <h3>Register and Donate Shoes for a Group of 30 Girls</h3>
                     <p>INR 21,000</p>
                </button>
            </div>

            
            
            <button className="appButton" onClick={addUser}>Register</button>
            </div>
        </div>
    );
};

export default AddUser;

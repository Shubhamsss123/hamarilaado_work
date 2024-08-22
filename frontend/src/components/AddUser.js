import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const addUser = async () => {
        
        let local_err = false;

        if (!name || !email || !gender || !phone || !city || !state || !country || !mode || !number || !consent) {
            setErr(true);
            local_err = true;
        } else {
            setErr(false);
        }

        if (!local_err) {
            let result = await fetch('http://127.0.0.1:4500/add-user', {
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
            <h1>Add User</h1>
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
            <input
                onChange={(e) => { setGender(e.target.value); }}
                value={gender}
                className="inputBox"
                type="text"
                placeholder="Enter Gender"
            />
            {err && !gender && <span className="invalid-input">Enter valid gender</span>}
            <input
                onChange={(e) => { setPhone(e.target.value); }}
                value={phone}
                className="inputBox"
                type="text"
                placeholder="Enter Phone"
            />
            {err && !phone && <span className="invalid-input">Enter valid phone</span>}
            <input
                onChange={(e) => { setConsent(e.target.value); }}
                value={consent}
                className="inputBox"
                type="text"
                placeholder="Enter consent number"
                />
                {err && !consent && <span className="invalid-input">Enter valid consent</span>}
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
            <input
                onChange={(e) => { setMode(e.target.value); }}
                value={mode}
                className="inputBox"
                type="text"
                placeholder="Enter Mode (e.g., in_person, online)"
            />
            {err && !mode && <span className="invalid-input">Enter valid mode</span>}
            <button className="appButton" onClick={addUser}>Add User</button>
        </div>
    );
};

export default AddUser;

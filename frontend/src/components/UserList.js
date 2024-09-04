import { useState, useEffect } from "react";

const UserList = () => {
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        let result = await fetch(`${process.env.REACT_APP_API_URL}/users`);
        result = await result.json();
        console.log(result);
        setUsers(result);
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="product-list">
            <h1>Users List</h1>

            {users.length > 0 ? (
                <ul>
                    {/* <li>Sr. no</li> */}
                    {/* <li>Number</li> */}
                    <li>Name</li>
                    <li>Gender</li>
                    <li>Consent</li>
                    <li>Email</li>
                    <li>Phone</li>
                    <li>City</li>
                    <li>State</li>
                    <li>Country</li>
                    <li>Mode</li>
                </ul>
            ) : (
                <h1>No Results Found!</h1>
            )}

            {users.map((item, index) => (
                <ul key={index}>
                    {/* <li>{index + 1}</li> */}
                    {/* <li>{item.number}</li> */}
                    <li>{item.name}</li>
                    <li>{item.gender}</li>
                    <li>{item.consent}</li>
                    <li>{item.email}</li>
                    <li>{item.phone}</li>
                    <li>{item.city}</li>
                    <li>{item.state}</li>
                    <li>{item.country}</li>
                    <li>{item.mode}</li>
                </ul>
            ))}
        </div>
    );
}

export default UserList;

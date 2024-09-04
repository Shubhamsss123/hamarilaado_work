import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";

const PaymentList = () => {
    const [payments, setPayments] = useState([]);

    const getPayments = async () => {
        let result = await fetch(`${process.env.REACT_APP_API_URL}/payments`);
        result = await result.json();
        console.log(result);
        setPayments(result);
    };

    useEffect(() => {
        getPayments();
    }, []);

    // const searchHandle = async (e) => {
    //     let key = e.target.value;
    //     if (key) {
    //         let result = await fetch(`http://127.0.0.1:4500/search-payment/${key}`, {
    //             headers: { authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}` }
    //         });
    //         result = await result.json();
    //         setPayments(result);
    //     } else {
    //         getPayments();
    //     }
    // };

    // const deletePayment = async (id) => {
    //     let result = await fetch(`http://127.0.0.1:4500/payment/${id}`, {
    //         method: 'delete',
    //         headers: { authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}` }
    //     });
    //     result = await result.json();
    //     console.log(result);
    //     if (result) {
    //         getPayments();
    //     }
    // };

    return (
        <div className="product-list">
            <h1>Payment List</h1>

            {/* <input
                type="text"
                className="search-payment-box"
                onChange={searchHandle}
                placeholder="Search Payment here"
            /> */}

            {payments.length > 0 ? (
                <ul>
                    <li>Sr. no</li>
                    <li>Name</li>
                    <li>Email</li>
                    <li>Contact</li>
                    <li>Amount</li>
                    <li>Order ID</li>
                    <li>Payment ID</li>
                    <li>Payment Status</li>
                    {/* <li>Operation</li> */}
                </ul>
            ) : (
                <h1>No Results Found!</h1>
            )}

            {payments.map((item, index) => (
                <ul key={index}>
                    <li>{index + 1}</li>
                    <li>{item.name}</li>
                    <li>{item.email}</li>
                    <li>{item.contact}</li>
                    <li>{item.amount}</li>
                    <li>{item.order_id}</li>
                    <li>{item.payment_id || "N/A"}</li>
                    <li>{item.payment_status}</li>
                    {/* <li>
                        <button onClick={() => deletePayment(item.order_id)}>Delete</button>
                        <Link to={`/update-payment/${item.order_id}`}>Update</Link>
                    </li> */}
                </ul>
            ))}
        </div>
    );
}

export default PaymentList;

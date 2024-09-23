import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
  const [paymentsData, setPaymentsData] = useState([]);
  const [filters, setFilters] = useState({
    regno: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showLogin, setShowLogin] = useState(true);
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    if (!showLogin) {
      fetchData();
    }
  }, [showLogin, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://girls5k.org/api/payments'); // Updated API endpoint
      console.log('API Response:', response.data);
      setPaymentsData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = formData.get('id');
    const password = formData.get('password');

    if (
      (id === 'Premlata' && password === 'Prem@2024') ||
      (id === 'Bharti' && password === 'Bharti@2024')
    ) {
      setShowLogin(false);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const filteredData = paymentsData.filter((payment) => {
    const created_at = new Date(payment.created_at);

    const isAnyFilterActive = 
      filters.regno !== '' ||
      filters.dateFrom !== '' ||
      filters.dateTo !== '';

    return (
      !isAnyFilterActive || 
      (
        (filters.regno === '' || payment.regno === parseInt(filters.regno, 10)) &&
        (filters.dateFrom === '' || created_at >= new Date(filters.dateFrom)) &&
        (filters.dateTo === '' || created_at <= new Date(filters.dateTo))
      )
    );
  });

  console.log('Filtered Data:', filteredData);

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: 'purple' }}>Details of Payments received for the 5k Run</h2>

      {showLogin && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
          <form onSubmit={handleLogin} style={{ marginLeft: '20px' }}>
            <div>
              <label htmlFor="id" style={{ color: '#4287f5' }}>ID:</label>
              <input type="text" id="id" name="id" />
            </div>
            <div>
              <label htmlFor="password" style={{ color: '#4287f5' }}>Password:</label>
              <input type="password" id="password" name="password" />
            </div>
            <button type="submit">Login</button>
            {loginError && <p style={{ color: 'red' }}>Invalid ID or password</p>}
          </form>
        </div>
      )}

      {!showLogin && (
        <div>
          <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ marginLeft: '20px' }}>
              <label htmlFor="regno" style={{ color: '#4287f5' }}>Registration No.:</label>
              <input
                type="number"
                id="regno"
                name="regno"
                value={filters.regno}
                onChange={handleFilterChange}
              />
            </div>

            <div style={{ marginLeft: '20px' }}>
              <label htmlFor="dateFrom" style={{ color: '#4287f5' }}>Payment Date From:</label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />

              <label htmlFor="dateTo" style={{ color: '#4287f5' }}>To:</label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {paymentsData.length === 0 ? (
            <p>Loading data...</p> 
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', color: 'blue', padding: '10px 0' }}>
                    Registration<br />No.
                  </th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Name</th>
                  <th style={{ textAlign: 'center', color: 'blue', padding: '10px 0' }}>
                    Payment<br />Date
                  </th> 
                  <th style={{ textAlign: 'right', color: 'blue' }}>Amount</th>
                  <th style={{ textAlign: 'left', color: 'blue', paddingLeft: '30px' }}>Email</th> 
                  <th style={{ textAlign: 'left', color: 'blue' }}>Contact</th>
                  <th style={{ textAlign: 'center', color: 'blue', padding: '10px 0' }}>
                    Order ID
                  </th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Payment ID</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((payment) => (
                  <tr key={payment.order_id}>
                    <td style={{ textAlign: 'center' }}>{payment.regno}</td>
                    <td style={{ textAlign: 'left' }}>{payment.name}</td> 
                    <td style={{ textAlign: 'center' }}>
                      {new Date(payment.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                    <td style={{ textAlign: 'right' }}>{payment.amount}</td> 
                    <td style={{ textAlign: 'left' }}>{payment.email}</td>
                    <td style={{ textAlign: 'left' }}>{payment.contact}</td>
                    <td style={{ textAlign: 'center' }}>{payment.order_id}</td>
                    <td style={{ textAlign: 'left' }}>{payment.payment_id}</td>
                    <td style={{ textAlign: 'left' }}>{payment.payment_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
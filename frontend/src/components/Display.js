import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Display = () => {
  const [usersData, setUsersData] = useState([]);
  const [filters, setFilters] = useState({
    regnoFrom: '',
    regnoTo: '',
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
      const response = await axios.get('https://girls5k.org/api/show-users');
      console.log('API Response:', response.data);
      setUsersData(response.data);
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

  const filteredData = usersData.filter((user) => {
    const regno = parseInt(user.regno, 10);
    const insertdate = new Date(user.insertdate);

    const isAnyFilterActive = 
      filters.regnoFrom !== '' ||
      filters.regnoTo !== '' ||
      filters.dateFrom !== '' ||
      filters.dateTo !== '';

    return (
      !isAnyFilterActive || 
      (
        (filters.regnoFrom === '' || regno >= parseInt(filters.regnoFrom, 10)) &&
        (filters.regnoTo === '' || regno <= parseInt(filters.regnoTo, 10)) &&
        (filters.dateFrom === '' || insertdate >= new Date(filters.dateFrom)) &&
        (filters.dateTo === '' || insertdate <= new Date(filters.dateTo))
      )
    );
  });

  console.log('Filtered Data:', filteredData);

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: 'purple' }}>Details of Registration for the 5K Run</h2>

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
              <label htmlFor="regnoFrom" style={{ color: '#4287f5' }}>Registration No. From:</label>
              <input
                type="number"
                id="regnoFrom"
                name="regnoFrom"
                value={filters.regnoFrom}
                onChange={handleFilterChange}
              />

              <label htmlFor="regnoTo" style={{ color: '#4287f5' }}>To:</label>
              <input
                type="number"
                id="regnoTo"
                name="regnoTo"
                value={filters.regnoTo}
                onChange={handleFilterChange}
              />
            </div>

            <div style={{ marginLeft: '20px' }}>
              <label htmlFor="dateFrom" style={{ color: '#4287f5' }}>Registration Date From:</label>
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

          {usersData.length === 0 ? (
            <p>Loading data...</p> 
          ) : (
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', color: 'blue', padding: '10px 0' }}>
                    Registration<br />No.
                  </th>
                  <th style={{ textAlign: 'center', color: 'blue', padding: '10px 0' }}>
                    Registration<br />Date
                  </th> 
                  <th style={{ textAlign: 'left', color: 'blue', paddingLeft: '20px' }}>Name</th>
                  <th style={{ textAlign: 'center', color: 'blue' }}>Gender</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Email</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Phone</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>City</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>State</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Country</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>Mode</th>
                  <th style={{ textAlign: 'left', color: 'blue' }}>PAN</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user) => (
                  <tr key={user.regno}>
                    <td style={{ textAlign: 'center' }}>{user.regno}</td>
                    <td style={{ textAlign: 'center' }}>
                      {new Date(user.insertdate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      })}
                    </td>
                    <td style={{ textAlign: 'left' }}>{user.name}</td> 
                    <td style={{ textAlign: 'center' }}>{user.gender}</td>
                    <td style={{ textAlign: 'left' }}>{user.email}</td>
                    <td style={{ textAlign: 'left' }}>{user.phone}</td>
                    <td style={{ textAlign: 'left' }}>{user.city}</td>
                    <td style={{ textAlign: 'left' }}>{user.state}</td>
                    <td style={{ textAlign: 'left' }}>{user.country}</td>
                    <td style={{ textAlign: 'left' }}>{user.mode}</td>
                    <td style={{ textAlign: 'left' }}>{user.pan}</td>
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

export default Display;
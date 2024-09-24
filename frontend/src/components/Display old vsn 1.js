import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HamariLaadoWork = () => {
  const [usersData, setUsersData] = useState([]);
  const [filters, setFilters] = useState({
    regnoFrom: '',
    regnoTo: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://girls5k.org/api/show-users');
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

  const filteredData = usersData.filter((user) => {
    const regno = parseInt(user.regno, 10);
    const insertdate = new Date(user.insertdate);

    return (
      (filters.regnoFrom === '' || regno >= parseInt(filters.regnoFrom, 10)) &&
      (filters.regnoTo === '' || regno <= parseInt(filters.regnoTo, 10)) &&
      (filters.dateFrom === '' || insertdate >= new Date(filters.dateFrom)) &&
      (filters.dateTo === '' || insertdate <= new Date(filters.dateTo))
    );
  });

  return (
    <div>
      <h2>Hamari Laado Work</h2>

      <div>
        <label htmlFor="regnoFrom">Registration No. From:</label>
        <input
          type="number"
          id="regnoFrom"
          name="regnoFrom"
          value={filters.regnoFrom}
          onChange={handleFilterChange}
        />

        <label htmlFor="regnoTo">To:</label>
        <input
          type="number"
          id="regnoTo"
          name="regnoTo"
          value={filters.regnoTo}
          onChange={handleFilterChange}
        />
      </div>

      <div>
        <label htmlFor="dateFrom">Registration Date From:</label>
        <input
          type="date"
          id="dateFrom"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
        />

        <label htmlFor="dateTo">To:</label>
        <input
          type="date"
          id="dateTo"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Phone</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Mode</th>
            <th>PAN</th>
            <th>Event No.</th>
            <th>Event Date</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((user) => (
            <tr key={user.regno}>
              <td>{user.regno}</td>
              <td>{user.name}</td>
              <td>{user.gender}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.city}</td>
              <td>{user.state}</td>
              <td>{user.country}</td>
              <td>{user.mode}</td>
              <td>{user.pan}</td>
              <td>{user.event_no}</td>
              <td>{user.event_date}</td>
              <td>{user.insertdate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HamariLaadoWork;
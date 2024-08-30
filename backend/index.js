const express=require('express');
const con=require('./db/config');

const app=express();

const cors=require('cors');
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('welcome to node backend of hamari laado ')
});

app.post('/add-user', (req, res) => {
    let data = req.body;
    
    // Insert data into the hl_users table
    con.query('INSERT INTO hl_users SET ?', data, (err, result) => {
        if (err) {
            // Handle error
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        // Success response
        res.status(200).send(result);
    });
});

app.post('/add-user-old',(req,res)=>{
    let data=req.body;
    con.query('insert into hl_users set ?',data,(err,result,field)=>{
        res.send(result);
    })
    res.send(data);
});

app.get('/show-users', (req, res) => {
    // Query to select all users
    con.query('SELECT * FROM hl_users', (err, results) => {
        if (err) {
            // Handle error
            console.error('Error retrieving users:', err);
            return res.status(500).send('Error retrieving users');
        }
        // Success response
        res.status(200).json(results);
    });
});

app.post('/',(req,res)=>{
    let data=req.body;
     con.query('insert into hl_users set ?',data,(err,result,field)=>{
         res.send(result);
     })
    res.send(data);
});

app.listen(1234, () => {
  console.log('Server is running on port 1234');
});

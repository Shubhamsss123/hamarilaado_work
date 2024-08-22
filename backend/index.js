const express=require('express');
const con=require('./db/config');
const app=express();

const cors=require('cors');
app.use(cors());
app.use(express.json());
app.get('',(req,res)=>{
    res.send('welcome to node backend of hamari laado ')
});

app.post('/add-user',(req,res)=>{
    let data=req.body;
    con.query('insert into hl_users set ?',data,(err,result,field)=>{
        res.send(result);
    })
    // res.send(data);
});
app.post('/',(req,res)=>{
    let data=req.body;
    // con.query('insert into hl_users set ?',data,(err,result,field)=>{
    //     res.send(result);
    // })
    res.send(data);
});

app.listen(4500);
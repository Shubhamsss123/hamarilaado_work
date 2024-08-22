const mysql      = require('mysql');
const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'hamarilaado_db'
});

con.connect((err)=>{
    if(err){
        console.warn('falied to connect :(');
    }else{
        console.warn('connection successful !');
    }
})

module.exports=con;
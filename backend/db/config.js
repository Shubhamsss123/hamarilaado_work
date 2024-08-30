const mysql      = require('mysql');
const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'Hl5k',
  password : 'Hl5k@2024',
  database : 'hamarilaado_db'
});

con.connect((err)=>{
    if(err){
	console.log(err);
        console.warn('falied to connect :(');
    }else{
        console.warn('connection successful !');
    }
})

module.exports=con;

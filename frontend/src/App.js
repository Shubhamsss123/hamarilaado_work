// import logo from './logo.svg';
import './App.css';
import AddUser from './components/AddUser';
import Nav from './components/Nav';
import PaymentButton from './components/PaymentButton';
import PaymentList from './components/PaymentList';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import UserList from './components/UserList';
function App() {
  return (
    <div className="App">
        
        <BrowserRouter>
        <Nav />
      <Routes >
       
        <Route path='/' element={<h1>Hamari Laado Foundation</h1>}> </Route>
        <Route path='/reg' element={<AddUser />} ></Route>
        <Route path='/payment' element={<PaymentButton />} ></Route>
        <Route path='/payment-list' element={<PaymentList />} ></Route>
        <Route path='/user-list' element={<UserList />} ></Route>

      </Routes>
        {/* <header className="App-header">
        </header> */}
     
      </BrowserRouter>
    </div>
  );
}

export default App;

// import logo from './logo.svg';
import './App.css';
import AddUser from './components/AddUser';
import Nav from './components/Nav';
import PaymentButton from './components/PaymentButton';
import PaymentList from './components/PaymentList';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import UserList from './components/UserList';
import Terms from './components/Terms';
import Display from './components/Display';

function App() {
  return (
    <div className="App">
        
        <BrowserRouter>
        <Nav />
      <Routes >
       
        <Route path='/' element={<AddUser />} ></Route>
        <Route path='/reg' element={<AddUser />} ></Route>
        <Route path='/terms' element={<Terms />} ></Route>
        <Route path='/display' element={<Display />} ></Route>

      </Routes>
        {/* <header className="App-header">
        </header> */}
     
      </BrowserRouter>
    </div>
  );
}

export default App;

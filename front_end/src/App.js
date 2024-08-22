// import logo from './logo.svg';
import './App.css';
import AddUser from './components/AddUser';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        
        <BrowserRouter>
      <Routes >
       
        <Route path='/' element={<h1>Hamari Laado Foundation</h1>}> </Route>
        <Route path='/reg' element={<AddUser />} ></Route>
      </Routes>
     
      </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

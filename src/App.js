import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import Login from './components/login and signup/login'
import New_Company from './components/login and signup/new_company';
import Homepage from './components/home/homepage';
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create-company" element={<New_Company />} />
      <Route path='/home' element={<Homepage />} />
      </Routes>
      </Router>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FoodInput from './pages/FoodInput'
import LoginInput from './pages/LoginInput'
import { ComplexNavbar } from './components/Navbar';
import RegisterInput from './pages/Register';
function App() {
  return (
   
    <Router>
      <div class="pt-2">
      <ComplexNavbar/>
        <Routes>
              {/* <Route exact path="/"/> */}
              <Route path="/Login" element={<LoginInput/>}/>
              <Route path="/Input" element={<FoodInput/>}/>
              <Route path="/Register" element={<RegisterInput/>}/>
              
        </Routes>
      </div>
    </Router>
   
  );
}

export default App;

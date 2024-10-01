import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FoodInput from './pages/FoodInput'
import { ComplexNavbar } from './components/Navbar';
function App() {
  return (
   
    <Router>
      <div class="pt-2">
      <ComplexNavbar/>
        <Routes>
              {/* <Route exact path="/"/> */}
              <Route path="/Input" element={<FoodInput/>}/>
              
        </Routes>
      </div>
    </Router>
   
  );
}

export default App;

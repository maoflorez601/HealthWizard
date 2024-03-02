import logo from './logo.svg';
import './App.css';
import Show from './components/Show';
import Edit from './components/Edit';
import Create from './components/Create';
import Register from './components/Register'
import Login from './components/Login'
import Recover from './components/Recover'
import muscleWizard from './muscle_wizard.png';

//importar router
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// *** function app de ejemplo ****
// * Se modificó en App.css el estilo de la clase App-header para que ocupara menos espacio en pantalla
function App() {
  return (
    <div className="App">
      
      <header className="App-header"> 
        {/* <img src={logo} className="App-logo" alt="logo" style={{ height: "120px"}} />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <h3 style={{ padding: "10px"}}>Hello Firebase, I'm App Health Wizard</h3>
        <button className="btn btn-danger">I'm useless!</button> */}
        <img src={muscleWizard} alt="Muscle Wizard" className="app-symbol"/>						
        <h1 className="app-title">Health Wizard</h1>

      </header>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={ <Login />} />
          <Route path='/register' element={ <Register />} />
          <Route path='/recover' element={ <Recover />} />
          <Route path='/create' element={ <Create />} />
          <Route path='/edit/:id' element={ <Edit />} />
          <Route path='/show' element={ <Show />} />          
        </Routes>
      </BrowserRouter>
      
    </div>
  );
} 

export default App;

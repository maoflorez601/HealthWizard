import './App.css';
import Home from './components/Home';
import Show from './components/Show';
import Edit from './components/Edit';
import Create from './components/Create';
import Register from './components/Register'
import Login from './components/Login'
import Recover from './components/Recover'
import HealthProfile from './components/HealthProfile'
import DietWizard from './components/DietWizard'
import AddFoodForm from './components/AddFoodForm'
import Rutinas from './components/Rutinas'

//import de recursos multimedia 
import muscleWizard from './muscle_wizard.png';

import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";

//importar router
import { BrowserRouter, Route, Routes, useLocation , Navigate  } from 'react-router-dom';

// importar librerias visuales
import { Container } from 'react-bootstrap';

// *** function app de ejemplo ****
// * Se modificó en App.css el estilo de la clase App-header para que ocupara menos espacio en pantalla
function App() {

  const [user, setUser] = useState(null);
  const auth = getAuth();

  const [home, setHome] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
      setUser(user);
      //location.pathname === '/' ? setHome(false) : setHome(true);
    });

    return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
  }, []); // Se ejecuta solo una vez al montar el componente

  const doSignOut = async (e) => {
    e.preventDefault()
    await signOut(auth).then(() => {
      // Sign-out successful.
      window.location.href = '/login';

    }).catch((error) => {
      // An error happened.
    })
  };

  return (
    <div className="App">
      
      <header className="App-header"> 
        <img src={muscleWizard} alt="Muscle Wizard" className="app-symbol"/>						
        <h1 className="app-title">Health Wizard</h1>
        {user ? (          
        <p>Bienvenido {user.email} <a href="#" onClick={doSignOut}>Cerrar sesión</a></p>    
        ) : (
          <p style={{ visibility: location && location.pathname === '/login' ? 'hidden' : 'visible' }}><a href="/login" >Iniciar sesión</a></p>
        )}
      </header> 
        <Container fluid> {/* Utiliza Container fluid de Bootstrap */}        
          <Routes>
            <Route path='/home' element={ <Home />} />
            <Route path='/login' element={ <Login />} />
            <Route path='/register' element={ <Register />} />
            <Route path='/recover' element={ <Recover />} />
            <Route path='/create' element={ <Create />} />
            <Route path='/edit/:id' element={ <Edit />} />
            <Route path='/show' element={ <Show />} />    
            <Route path='/HealthProfile' element={ <HealthProfile />} />   
            <Route path='/DietWizard' element={ <DietWizard />} /> 
            <Route path='/AddFood' element={ <AddFoodForm />} /> 
            <Route path='/Rutinas' element={ <Rutinas />} />
            {/* Redireccionar al inicio si el usuario intenta acceder a rutas protegidas sin iniciar sesión */}
            {!user && <Route path='/*' element={<Navigate to="/login" />} />}      
          </Routes>
        </Container>
      
    </div>
  );
} 

export default App;

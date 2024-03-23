// Home.js
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

import { getAuth } from "firebase/auth";

const Home = () => {

    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {

        const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
            setUser(user);
            });        
        // eslint-disable-next-line
        return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
    }, [])

  return (
    <div className='container'>
        {user ? (
            <>
                <div className="container mt-4">
                    <h2 className="mb-4">Menú</h2>

                    <ul className="list-group">
                        <li className="list-group-item bg-dark">
                            <Link to="/HealthProfile" className="text-white">Actualizar perfil de salud</Link> {/* Usa Link en lugar de <a> */}
                        </li>

                        <li className="list-group-item bg-dark">
                            <Link to="/DietWizard" className="text-white">Información nutricional</Link> {/* Usa Link en lugar de <a> */}
                        </li>                        

                        <li className="list-group-item bg-dark">
                            <Link to="/AddFood" className="text-white">Agregar alimentos</Link> {/* Usa Link en lugar de <a> */}
                        </li>

                        <li className="list-group-item bg-dark">
                            <Link to="/rutinas" className="text-white">Rutinas de ejercicio</Link> {/* Usa Link en lugar de <a> */}
                        </li>
                    </ul>
                </div>
            </>
            ) : ( <h1 className='text-danger'>Inicie sesión para acceder a este contenido</h1> )        
        }
    </div>
  )
}

export default Home

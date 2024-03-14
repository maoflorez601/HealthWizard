import React, { useState, useEffect } from 'react'

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
                            <a href="/HealthProfile" className="text-white">Actualizar perfil de salud</a>
                        </li>

                        <li className="list-group-item bg-dark">
                            <a href="/DietWizard" className="text-white">Información nutricional</a>
                        </li>                        

                        <li className="list-group-item bg-dark">
                            <a href="/AddFood" className="text-white">Agregar alimentos</a>
                        </li>

                        <li className="list-group-item bg-dark">
                            <a href="#" className="text-white">Rutinas de ejercicio</a>
                        </li>
                    </ul>
                </div>
            </>
            ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )        
        }
    </div>
  )
}

export default Home
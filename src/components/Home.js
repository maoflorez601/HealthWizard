import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

const Home = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className='container'>
            {user ? (
                <>
                    <div className="container mt-4">
                        <h2 className="mb-4">Menú</h2>
                        <ul className="list-group">
                            <li className="list-group-item bg-dark">
                                <Link to="/HealthProfile" className="text-white">Actualizar perfil de salud</Link>
                            </li>
                            <li className="list-group-item bg-dark">
                                <Link to="/DietWizard" className="text-white">Información nutricional</Link>
                            </li>
                            <li className="list-group-item bg-dark">
                                <Link to="/AddFood" className="text-white">Agregar alimentos</Link>
                            </li>
                            <li className="list-group-item bg-dark">
                                <Link to="#" className="text-white">Rutinas de ejercicio</Link>
                            </li>
                            <li className="list-group-item bg-dark">
                                <Link to="/RegisterPhatologies" className="text-white">Registrar Patologías</Link>
                            </li>
                        </ul>
                    </div>
                </>
            ) : (
                <h1 className='text-danger'>Inicie sesión para acceder a este contenido</h1>
            )}
        </div>
    );
}

export default Home;

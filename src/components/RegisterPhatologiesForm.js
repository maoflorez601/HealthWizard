import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

const RegisterPhatologiesForm = () => {
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const [newPatology, setNewPatology] = useState('');
    const [selectedPatology, setSelectedPatology] = useState('');

    // Lista de patologías disponibles
    const commonPatologies = [
        "Hipertensión arterial",
        "Diabetes mellitus tipo 2",
        "Obesidad",
        "Sobrepeso",
        "Dislipidemia",
        "Enfermedad renal crónica",
        "Enfermedad pulmonar obstructiva crónica (EPOC)",
        "Asma",
        "Cáncer de mama",
        "Cáncer de próstata",
        "Cáncer de cuello uterino",
        "Cáncer de colon y recto",
        "Depresión",
        "Ansiedad",
        "Trastorno por déficit de atención e hiperactividad (TDAH)",
        "Trastorno bipolar",
        "Esquizofrenia",
        "Demencia",
        "Osteoporosis",
        "Artritis",
        "Enfermedad cardiovascular"
    ];

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handlePatologyChange = (e) => {
        setNewPatology(e.target.value);
    };

    const handleAddPatology = () => {
        setSelectedPatology(newPatology);
        setNewPatology('');
    };

    const handleRegisterPhatologies = async () => {
        try {
            const patologiesRef = collection(db, 'pathologies');
            await addDoc(patologiesRef, {
                user: user.email,
                patology: selectedPatology // Guarda solo la patología seleccionada
            });
            console.log('Patología registrada correctamente:', selectedPatology);
            setSelectedPatology('');
        } catch (error) {
            console.error('Error al registrar patología:', error);
        }
    };

    return (
        <div className='container'>
            <div className="container mt-4">
                <h2>Registrar Patología</h2>
                <div>
                    {/* Menú desplegable para seleccionar la patología */}
                    <select value={newPatology} onChange={handlePatologyChange}>
                        <option value="">Selecciona una patología...</option>
                        {commonPatologies.map((patology, index) => (
                            <option key={index} value={patology}>{patology}</option>
                        ))}
                    </select>
                    <button onClick={handleAddPatology}>Agregar Patología</button>
                </div>
                <div>
                    {/* Muestra la patología seleccionada */}
                    {selectedPatology && <p>Patología seleccionada: {selectedPatology}</p>}
                </div>
                <button onClick={handleRegisterPhatologies}>Registrar Patología</button>
            </div>
        </div>
    )
}

export default RegisterPhatologiesForm;

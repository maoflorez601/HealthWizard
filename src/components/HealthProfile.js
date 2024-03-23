import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HealthProfile = () => {
    const diseasesPerGroup = {
        'Enfermedades Cardiovasculares': ['Hipertensión arterial', 'Enfermedad coronaria', 'Insuficiencia cardíaca congestiva'],
        'Enfermedades Respiratorias': ['Asma', 'Enfermedad pulmonar obstructiva crónica (EPOC)', 'Fibrosis pulmonar'],
        'Enfermedades Endocrinas': ['Diabetes mellitus tipo 1 y tipo 2', 'Hipotiroidismo', 'Hipertiroidismo'],
        // Agrega más grupos y patologías según sea necesario
    };

    const [selectGroup, setSelectGroup] = useState('');
    const [selectDisease, setSelectDisease] = useState('');
    const [listDiseases, setListDiseases] = useState([]);
    const [height, setHeight] = useState(''); // Altura en centímetros
    const [weight, setWeight] = useState(''); // Peso en kilogramos
    const [heartRate, setHeartRate] = useState('');
    const [sistole, setSistole] = useState('');
    const [diastole, setDiastole] = useState('');
    const [bloodOxigen, setBloodOxigen] = useState('');
    const [bloodGlucose, setBloodGlucose] = useState('');
    const [bmi, setBMI] = useState('');

    const healthprofileCollection = collection(db, 'healthprofiles');
    const [user, setUser] = useState(null);
    const auth = getAuth();
    const navigate = useNavigate();

    const handleGrupoChange = (e) => {
        setSelectGroup(e.target.value);
        setSelectDisease('');
    };

    const handlePatologiaChange = (e) => {
        setSelectDisease(e.target.value);
    };

    const addDisease = () => {
        if (selectDisease) {
            setListDiseases([...listDiseases, selectDisease]);
            setSelectDisease('');
        }
    };

    const saveHealthProfile = async () => {
        try {
            const bmiValue = calculateBMI(height, weight);
            await addDoc(healthprofileCollection, {
                userEmail: user.email,
                listDiseases: listDiseases,
                height: height,
                weight: weight,
                heartRate: heartRate,
                sistole: sistole,
                diastole: diastole,
                bloodOxigen: bloodOxigen,
                bloodGlucose: bloodGlucose,
                bmi: bmiValue
            });
            Swal.fire("Perfil de salud creado exitosamente.","Perfil Salud Usuario","success");
            console.log('Perfil de salud guardado en Firestore');
            navigate('/Show');
        } catch (error) {
            console.error('Error al guardar el perfil de salud en Firestore:', error);
        }
    };

    const calculateBMI = (height, weight) => {
        if (height && weight) {
            const heightMeters = height / 100; // Convertir la altura a metros
            return (weight / (heightMeters * heightMeters)).toFixed(2);
        }
        return '';
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setBMI(calculateBMI(height, weight));
    }, [height, weight]);

    return (        
        <div className="container">
            {user ? (
                <>
                <h2>Perfil de Salud</h2>
                <div className="row align-items-center">
                    <div className="col-md-4">
                        <label>Grupo de Patología:</label>
                        <select className="form-select" value={selectGroup} onChange={handleGrupoChange}>
                            <option value="">Seleccionar Grupo</option>
                            {Object.keys(diseasesPerGroup).map((grupo, index) => (
                                <option key={index} value={grupo}>{grupo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label>Patología:</label>
                        <select className="form-select" value={selectDisease} onChange={handlePatologiaChange}>
                            <option value="">Seleccionar Patología</option>
                            {diseasesPerGroup[selectGroup] && diseasesPerGroup[selectGroup].map((disease, index) => (
                                <option key={index} value={disease}>{disease}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <button className="btn btn-primary" onClick={addDisease}>Agregar Patología</button>
                    </div>
                </div>

                <div className='row my-4'>
                    <div className="col-md-4">
                        <h5>Enfermedades Preexistentes:</h5>
                    </div>

                    <div className="col-md-8 text-start">
                        <ul className="list-unstyled">
                            {listDiseases.map((disease, index) => (
                                <span key={index} className="badge bg-primary me-2 mb-2">{disease}</span>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-3 my-2 text-end">
                        <label className='form-label text-end'>Frecuencia cardiaca</label>                    
                    </div>

                    <div className="col-md-1 my-2">
                        <input 
                            value={heartRate}
                            onChange={ (e) => setHeartRate(e.target.value)}
                            type='number'
                            className='form-control'
                        />
                    </div>

                    <div className="col-md-8 text-start">
                        <p>Pulsaciones por minuto</p>        
                    </div>
                </div>

                <div className="row align-items-center">

                    <div className="col-md-3 my-2 text-end">
                        <label className='form-label'>Presión arterial</label>                    
                    </div>

                    <div className="col-md-1 my-2">
                        <input 
                            value={sistole}
                            onChange={ (e) => setSistole(e.target.value)}
                            type='number'
                            className='form-control'
                        />
                    </div>

                    <div className="col-md-1 my-2">
                        <h2>/</h2> 
                    </div>

                    <div className="col-md-1 my-2">
                        <input 
                            value={diastole}
                            onChange={ (e) => setDiastole(e.target.value)}
                            type='number'
                            className='form-control'
                                />
                                </div>  
            
                                <div className="col-md-6 text-start">
                                    <p>mmHg</p>        
                                </div>            
                            </div>
            
                            <div className="row align-items-center">
                                <div className="col-md-3 my-2 text-end">
                                    <label className='form-label'>Oxigeno en sangre</label>                    
                                </div>
            
                                <div className="col-md-1 my-2">
                                    <input 
                                        value={bloodOxigen}
                                        onChange={ (e) => setBloodOxigen(e.target.value)}
                                        type='number'
                                        className='form-control'
                                    />
                                </div>
            
                                <div className="col-md-8 my-2 text-start">
                                    <label>%</label> 
                                </div>
                            </div>
            
                            <div className="row align-items-center">
            
                                <div className="col-md-3 my-2 text-end">
                                    <label className='form-label'>Glucosa en sangre</label>                    
                                </div>
                                <div className="col-md-1 my-2">
                                    <input 
                                        value={bloodGlucose}
                                        onChange={ (e) => setBloodGlucose(e.target.value)}
                                        type='number'
                                        className='form-control'
                                    />
                                </div>
            
                                <div className="col-md-8 text-start">
                                    <p>mg/dL</p>        
                                </div> 
            
                            </div>
            
                            <div className="row align-items-center">
                                <div className="col align-items-center my-2">
                                    <button className="btn btn-success" onClick={saveHealthProfile} >Guardar Perfil de Salud</button> 
                                </div>            
                            </div>
                            </>
                        ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )}
                    </div>
                    
                )
            }
              
            export default HealthProfile;
            
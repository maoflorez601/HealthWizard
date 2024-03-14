import React, { useState, useEffect } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'
import { getAuth} from "firebase/auth";
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const HealthProfile = () => {
    // Lista de grupos de patologías y sus patologías asociadas
    const diseasesPerGroup = {
      'Enfermedades Cardiovasculares': ['Hipertensión arterial', 'Enfermedad coronaria', 'Insuficiencia cardíaca congestiva'],
      'Enfermedades Respiratorias': ['Asma', 'Enfermedad pulmonar obstructiva crónica (EPOC)', 'Fibrosis pulmonar'],
      'Enfermedades Endocrinas': ['Diabetes mellitus tipo 1 y tipo 2', 'Hipotiroidismo', 'Hipertiroidismo'],
      // Agrega más grupos y patologías según sea necesario
    };
  
    // Hooks para almacenar el grupo seleccionado, la patología seleccionada y la lista de patologías
    const [selectGroup, setSelectGroup] = useState('');
    const [selectDisease, setSelectDisease] = useState('');
    const [listDiseases, setListDiseases] = useState([]);
    const [heartRate, setHeartRate] = useState(''); //frec cardiaca [normal entre 60 y 100 pulsaciones por minuto]
    //const [bloodPresure, setBloodPresure] = useState(''); //pres arterial
    const [sistole, setSistole] = useState(''); //pres arterial [normal alrededor de 120/80 mmHg]
    const [diastole, setDiastole] = useState(''); //pres arterial [normal alrededor de 120/80 mmHg]
    const [bloodOxigen, setBloodOxigen] = useState(''); // saturacion oxigeno en sangre [normal entre 95% y 100%]
    const [bloodGlucose, setBloodGlucose] = useState(''); //nivel glucosa en sangre [normal entre 70 y 100 mg/dL]

    //hooks para las colecciones de la db de firestore
    const healthprofileCollection = collection(db, 'healthprofiles');

    const [user, setUser] = useState(null);

    const auth = getAuth();
    //setUser(auth.currentUser);
    //onsole.log("user " + user.email);

    // hook para navegacion
    const navigate = useNavigate()

    // Manejar cambio de grupo
    const handleGrupoChange = (e) => {
        setSelectGroup(e.target.value);
        // Limpiar la selección de patología cuando cambie el grupo
        setSelectDisease('');
    };

    // Manejar cambio de patología
    const handlePatologiaChange = (e) => {
        setSelectDisease(e.target.value);
    };

    // Agregar patología a la lista
    const addDisease = () => {
        if (selectDisease) {
            setListDiseases([...listDiseases, selectDisease]);
        // Limpiar la selección de patología después de agregarla a la lista
        setSelectDisease('');
        }
    };

    // Guardar lista de patologías en BD Firestore
    const saveHealthProfile = async () => {
        try {
        // Iterar sobre cada patología en la lista y agregarla a Firestore
        // listDiseases.forEach(async () => {            
        // });

            await addDoc(healthprofileCollection, {
                userEmail: user.email,
                listDiseases: listDiseases,
                heartRate: heartRate,
                sistole: sistole,
                diastole: diastole,
                bloodOxigen: bloodOxigen,
                bloodGlucose: bloodGlucose
            }).then( () => {
                Swal.fire("Perfil de salud creado exitosamente.","Perfil Salud Usuario","success");                
                console.log('Lista de patologías guardada en Firestore');
                navigate('/Show')
            });

            
            // Limpiar la lista de patologías después de guardarla en Firestore
            setListDiseases([]);
        } catch (error) {
        console.error('Error al guardar la lista de patologías en Firestore:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
            setUser(user);
            });        
        // eslint-disable-next-line
        return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
    }, [])
  
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
            ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )};
        </div>
        
    )
}
  
export default HealthProfile;
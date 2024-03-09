import React, { useState, useEffect }from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'
import { getAuth} from "firebase/auth";

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
    const [heartRate, setHeartRate] = useState(''); //frec cardiaca
    const [bloodPresure, setBloodPresure] = useState(''); //pres arterial
    const [bloodOxigen, setBloodOxigen] = useState(''); // saturacion oxigeno en sangre
    const [bloodGlucose, setBloodGlucose] = useState(''); //nivel glucosa en sangre

    //hooks para las colecciones de la db de firestore
    const healthprofileCollection = collection(db, 'healthprofiles');

    const auth = getAuth();
    const user = auth.currentUser;
    //onsole.log("user " + user.email);

    


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
        listDiseases.forEach(async () => {
            await addDoc(healthprofileCollection, { 
                userEmail: user.email,
                listDiseases: listDiseases,
                heartRate: heartRate,
                bloodPresure: bloodPresure,
                bloodOxigen: bloodOxigen,
                bloodGlucose: bloodGlucose
            });
        });
        console.log('Lista de patologías guardada en Firestore');
        // Limpiar la lista de patologías después de guardarla en Firestore
        setListDiseases([]);
        } catch (error) {
        console.error('Error al guardar la lista de patologías en Firestore:', error);
        }
    };

    // useEffect(() => {
    //     const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
    //       setUser(user);
    //       //location.pathname === '/' ? setHome(false) : setHome(true);
    //     });
    // });
  
    return (
        <div className="container">
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
                <h3>Lista de Patologías:</h3>
                <ul>
                    {listDiseases.map((patologia, index) => (
                        <li key={index}>{patologia}</li>
                    ))}
                </ul>
            </div>

            <div className="row align-items-center">
                <div className="col-md-3 my-2">
                    <label className='form-label'>Frecuencia cardiaca</label>                    
                </div>

                <div className="col-md-3 my-2">
                    <input 
                        value={heartRate}
                        onChange={ (e) => setHeartRate(e.target.value)}
                        type='text'
                        className='form-control'
                    />
                </div>

                <div className="col-md-3">
                    <p>Pulsaciones por minuto</p>        
                </div>
            </div>

            <div className="row align-items-center">
                <div className="col-md-3 my-2">
                    <label className='form-label'>Presión arterial</label>                    
                </div>
                <div className="col-md-3 my-2">
                    <input 
                        value={bloodPresure}
                        onChange={ (e) => setBloodPresure(e.target.value)}
                        type='text'
                        className='form-control'
                    />
                </div>    
                <div className="col-md-3">
                    <p>mmHg</p>        
                </div>            
            </div>

            <div className="row align-items-center">
                <div className="col-md-4 md-4 my-2 mx-2">
                    <label className='form-label'>Oxigeno en sangre</label>                    
                </div>
                <div className="col-md-4 md-4 my-2 mx-2">
                    <input 
                        value={bloodOxigen}
                        onChange={ (e) => setBloodOxigen(e.target.value)}
                        type='text'
                        className='form-control'
                    />
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col-md-4 md-4 my-2 mx-2">
                    <label className='form-label'>Glucosa en sangre</label>                    
                </div>
                <div className="col-md-4 md-4 my-2 mx-2">
                    <input 
                        value={bloodGlucose}
                        onChange={ (e) => setBloodGlucose(e.target.value)}
                        type='text'
                        className='form-control'
                    />
                </div>
            </div>
            <div className="row align-items-center">
                <div className="col align-items-center my-2">
                    <button className="btn btn-success" onClick={saveHealthProfile} >Guardar Perfil de Salud</button> 
                </div>            
            </div>
        </div>
      );
    };
  
  export default HealthProfile;
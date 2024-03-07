import React, { useState }from 'react'
import { useNavigate } from 'react-router-dom'
import { doCreateUserWithEmailAndPassword } from '../firebaseConfig/auth'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'

//import dialog
import Swal from 'sweetalert2'

const Register = () => {

    //hooks para valores del formulario
    const [ name, setName] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ birth, setBirth] = useState('')
    const [ weight, setWeight] = useState(0)
    const [ height, setHeight] = useState(0)
    const [ objetive, setObjetive] = useState('')

    // hook para navegacion
    const navigate = useNavigate()

    //hook para operaciones con la db  de firebase
    const usersCollection = collection(db, "users")

    const registerUser = async (e) => {
        e.preventDefault()
        await doCreateUserWithEmailAndPassword(email, password)
            .then( (userCredential) => {
                // Signed up
                const user = userCredential.user;
                console.log(user.email + " successful registered in firebase.");
                
                //si la autorización es exitosa se procede a registrar al usuario en la db de firebase
                addDoc( usersCollection, {name: name, email: email, password: password, birth: birth, weight: weight, height: height, objetive: objetive})
                .then( (userCredential) => {
                    Swal.fire("Usuario registrado exitosamente.","Registro usuario","success");                
                    console.log("data successful insert in firestore.");
                    navigate('/Show')
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    Swal.fire("Error al intentar registrar datos en BD",errorMessage,"error");
                    console.log("Error firestore registration: " + error.code + ": " + error.message)
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire("Error al intentar registrar usuario",errorMessage,"error");
                console.log("Error user registration " + error.code + ": " + error.message)
              });

        
        // console.log("Nombre: " + e.target[0].value,)
        // console.log("Email: " + e.target[1].value,)
        // console.log("Password: " + e.target[2].value,)
        // console.log("Nacimiento: " + e.target[3].value,)
        // console.log("Peso: " + e.target[4].value,)
        // console.log("Altura: " + e.target[5].value,)
        // console.log("Objetivo: " + e.target[6].value,)
    }
  return (
    <div className='container'>
      <div className='row'>
          <div className='col'>
            <h1>Registrar nuevo usuario</h1>

            <form onSubmit={registerUser}>
                <div className='mb-3'>
                    <label className='form-label'>Nombre completo</label>
                    <input 
                        value={name}
                        onChange={ (e) => setName(e.target.value)}
                        type='text'
                        className='form-control'
                    />
                </div>
              <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input 
                  value={email}
                  onChange={ (e) => setEmail(e.target.value)}
                  type='text'
                  className='form-control'
                />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Password</label>
                <input 
                  value={password}
                  onChange={ (e) => setPassword(e.target.value)}
                  type='password'
                  className='form-control'
                />
              </div>

                <div className="mb-3">
                    <label htmlFor="inputDOB" className="form-label">Fecha de Nacimiento:</label>
                    <input 
                        value={birth}
                        onChange={ (e) => setBirth(e.target.value)}
                        type='date'
                        className='form-control'
                        id="inputDOB"
                    />
                </div>
                <div className="mb-3">
                    <label className='form-label'>Peso (Kg)</label>
                    <input 
                        value={weight}
                        onChange={ (e) => setWeight(e.target.value)}
                        type='number'
                        className='form-control'
                    />
                </div>
                <div className="mb-3">
                    <label className='form-label'>Estatura (cm)</label>
                    <input 
                        value={height}
                        onChange={ (e) => setHeight(e.target.value)}
                        type='number'
                        className='form-control'
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputFitnessGoal" className="form-label">Objetivo de Fitness:</label>
                    <select value={objetive} onChange={ (e) => setObjetive(e.target.value)} className="form-select" id="inputFitnessGoal" name="fitnessGoal" required>
                        <option value="">Seleccionar objetivo de fitness</option>
                        <option value="lose_weight">Perder peso</option>
                        <option value="build_muscle">Ganar masa muscular</option>
                        <option value="improve_fitness">Mejorar la condición física</option>
                        <option value="other">Otro</option>
                    </select>
                </div>
              <button type='submit' className='btn btn-primary'>Register</button>
              <button onClick={ () => { navigate('/')}} className='btn btn-secondary'>Cancelar</button>
            </form>
          </div>
      </div>
    </div>
  )
}
export default Register

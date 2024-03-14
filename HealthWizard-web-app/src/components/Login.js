import React, { useState }from 'react'
import { useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../firebaseConfig/auth'

//import dialog
import Swal from 'sweetalert2'

const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault()
        await doSignInWithEmailAndPassword(email, password)
            .then( (userCredential) => {
                // Loged in
                //navigate('/show')
                navigate('/home')
                //Swal.fire("Ingreso exitoso","","success");

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire("Error al intentar ingresar",errorMessage,"error");
                console.log("Error user login " + error.code + ": " + error.message)
              });

        //console.log("Email: " + e.target[0].value,)
        //console.log("Password: " + e.target[1].value,)
    }
  return (
    <div className="container">
        <div className="login-form">
            <div className="main-div">
                <div className="panel">
                    <p className="app-intro">Bienvenido a Health Wizard, tu solución mágica para el manejo de la salud.</p>
                    <h2>Ingresar</h2>
                    <p>Por favor introduzca su nombre de usuario y contraseña</p>
                </div>
                <form onSubmit={loginUser} className='login-form'>
                    <div className='mb-3'>
                        <label className='form-label text-white'>Email</label>
                        <input 
                        value={email}
                        onChange={ (e) => setEmail(e.target.value)}
                        type='text'
                        className='form-control'
                        placeholder="Email" required
                        />
                    </div>

                    <div className='mb-3'>
                        <label className='form-label text-white'>Password</label>
                        <input 
                        value={password}
                        onChange={ (e) => setPassword(e.target.value)}
                        type='password'
                        className='form-control'
                        placeholder="Contraseña" required                  
                        />
                    </div>
                    <div className='mb-3'>
                        <button type='submit' className='btn btn-primary'>Ingresar</button>
                        {/* <button onClick={ () => { navigate('/')}} className='btn btn-secondary'>Cancelar</button> */}
                    </div>

                    <div className='mt-1'>
                        <a href="/recover">¿Olvido su contraseña?</a>
                    </div>
                    
            </form>
                <p id="message"></p>
                <div className="mt-3 ">
                    <p className='text-white'>¿No tiene una cuenta? <a href="/register">Registrarse aquí</a></p>
                </div>
            </div>
        </div>
    </div>
  )  
}
export default Login

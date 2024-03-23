import React, { useState }from 'react'
import { useNavigate } from 'react-router-dom'

const Recover = () => {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const navigate = useNavigate()

  return (
    <div class="container">
        <div class="reset-form">
            <div class="main-div">
                <div class="panel">
                    <h2>Recuperar Contraseña</h2>
                </div>
                <form className='login-form'>
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
                        <label className='text-white'>Password</label>
                        <input 
                        value={password}
                        onChange={ (e) => setPassword(e.target.value)}
                        type='password'
                        className='form-control'
                        placeholder="Contraseña" required                  
                        />
                    </div>
                    <div className='mb-3'>
                        <button type='submit' className='btn btn-primary'>Recuperar contraseña</button>
                    </div>
                    <p id="message"></p>
                    <div className="mt-3">
                        <p className="text-white">¿Recuerdas tu contraseña? <a href="/">Inicia sesión aquí</a></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Recover
import React, { useState, useEffect }from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'
import { getAuth } from "firebase/auth";

const Create = () => {
  const [ description, setDescription ] = useState('')
  const [ stock, setStock] = useState(0)
  const navigate = useNavigate()

  const productsCollection = collection(db, "products")

  const [user, setUser] = useState(null);
  const auth = getAuth();

  const store = async (e) => {
    e.preventDefault()
    await addDoc( productsCollection, {description: description, stock: stock})
    navigate('/')
    console.log("Nombre producto: " + e.target[0].value,)
    console.log("Cantidad en inventario: " + e.target[1].value,)    
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
      setUser(user);
    });

    return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
  }, []); // Se ejecuta solo una vez al montar el componente

  return (    
    <div className='container'>      
      <div className='row'>
          <div className='col'>
            <h1>Create Product</h1>

            <form onSubmit={store}>
              <div className='mb-3'>
                <label className='form-label'>Description</label>
                <input 
                  value={description}
                  onChange={ (e) => setDescription(e.target.value)}
                  type='text'
                  className='form-control'
                />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Stock</label>
                <input 
                  value={stock}
                  onChange={ (e) => setStock(e.target.value)}
                  type='number'
                  className='form-control'
                />
              </div>
              <button type='submit' className='btn btn-primary'>Store</button>
              <button onClick={ () => { navigate('/')}} className='btn btn-secondary'>Cancelar</button>
            </form>
          </div>
      </div>
    </div> 

  );
}

export default Create
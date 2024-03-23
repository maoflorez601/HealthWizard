import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebaseConfig/firebase'

import { getAuth } from "firebase/auth";

//import styles
import Swal from 'sweetalert2'

import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal);

const Show = () => {

    // 1. Configuracion de hooks
    const [products, setProducts] = useState( [] );

    // 2. Referencias a la DB Firestore
    const productsCollection = collection(db, "products");

    const [user, setUser] = useState(null);
    const auth = getAuth();

    // 3. Funcion para mostras  TODOS los docs
    const getProducts = async () => {
        const data = await getDocs(productsCollection)
        //console.log(data.docs)

        setProducts(
            data.docs.map( (doc) => ( {...doc.data(), id:doc.id}))
        )
        console.log(products);
    }   

    // 4. Funcion para eliminar un doc
    const deleteProduct = async (id) => {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        getProducts();
    }

    // 5. Funcion de confirmación para Sweet Alert 2
    const confirmDelete = (id) => {
        MySwal.fire({
            title: "Desea eliminar el producto?",
            text: "Este cambio no se puede revertir!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Dale, sin miseria!"
          }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(id)
                Swal.fire({
                    title: "Eliminado!",
                    text: "El producto ha sido eliminado.",
                    icon: "success"
                });
            }
          });
    }    

    // 6. Uso de useEffect
    useEffect(() => {
        getProducts()

        const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
            setUser(user);
            });        
        // eslint-disable-next-line
        return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
    }, [])
    

    // 7. Devolver vista del componente
    return (
        //<div>Show</div>
        <>
        <div className='container'>
            {user ? (
                <div className='row'>
                    <div className='col'>
                        <div className='d-grid gap-2'>
                            <Link to="/create" className='btn btn-success mt-2 mb-2'>Create</Link>
                        </div>

                        <table className='table table-dark table-hover'>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                { products.map( (product) => (
                                    <tr key={product.id}>
                                        <td>{product.description}</td>
                                        <td>{product.stock}</td>
                                        <td>
                                            <Link to={`/edit/${product.id}`} className='btn btn-light'>
                                                <i className='fa-solid fa-pencil'></i>
                                            </Link>
                                            <button onClick={ () => { confirmDelete(product.id) }} className='btn btn-danger'>
                                            <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )) }
                            </tbody>

                        </table>
                    </div>
                </div>
            ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )};
            
        </div>
        </>
    )
}

export default Show
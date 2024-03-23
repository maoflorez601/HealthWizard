import React, { useState, useEffect } from 'react'
import { getAuth} from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';
import Swal from 'sweetalert2'

const AddFoodForm = () => {

    //manejo de sesiones activas
    const [user, setUser] = useState(null);
    const auth = getAuth();

  const [foods, setFoods] = useState([]);
  const [foodData, setFoodData] = useState({
    nombre: '',
    categoria: '',
    proteinas: '',
    carbohidratos: '',
    grasas: ''
  });

    const food_categories = [
        'Frutas y verduras',
        'Granos enteros',
        'Proteínas animales',
        'Proteínas vegetales',
        'Grasas saludables',
        'Leches vegetales',
        'Integrales y cereales',
        'Bebidas',
        'Snacks',
        'Salsas y especias',
        'Enlatados',
        'Panaderia y reposteria'
    ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFoodData({ ...foodData, [name]: value });
  };

  // se encarga de manejar los cambio en el campo de categoria
  const handleCategoryChange = (e) => {
    const categoryValue = e.target.value;
    setFoodData({ ...foodData, categoria: categoryValue });
  };

  const handleAddFood = () => {
    setFoods([...foods, foodData]);
    // Limpiar los campos del formulario después de agregar el alimento
    setFoodData({
      nombre: '',
      categoria: '',
      proteinas: '',
      carbohidratos: '',
      grasas: ''
    });
  };

  const handleSaveFoods = async () => {
    try {
      await Promise.all(foods.map(async (food) => {
        await addDoc(collection(db, 'foods'), food);
      }));
      // Limpiar la lista de alimentos después de guardar en la base de datos
      setFoods([]);
      console.log('Alimentos guardados en la base de datos');
      Swal.fire("Alimentos agregados exitosamente.","Agregar alimentos","success");  
    } catch (error) {
      console.error('Error al guardar alimentos en la base de datos: ', error);
      Swal.fire("Error al intentar registrar alimentos",error.message,"error");
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
    <div className='container'>
        {user ? (
        <>
            <h2>Agregar Alimentos</h2>
            <form>
                <div className="row align-items-center">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="nombre" name="nombre" value={foodData.nombre} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="categoria" className="form-label">Categoría</label>
                        {/* <input type="text" className="form-control" id="categoria" name="categoria" value={foodData.categoria} onChange={handleInputChange} /> */}
                        <select className="form-select" value={foodData.categoria} onChange={handleCategoryChange}>
                            <option value="">Seleccionar Categoría</option>
                            {food_categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="proteinas" className="form-label">Proteínas</label>
                        <input type="number" className="form-control" id="proteinas" name="proteinas" value={foodData.proteinas} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="carbohidratos" className="form-label">Carbohidratos</label>
                        <input type="number" className="form-control" id="carbohidratos" name="carbohidratos" value={foodData.carbohidratos} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="grasas" className="form-label">Grasas</label>
                        <input type="number" className="form-control" id="grasas" name="grasas" value={foodData.grasas} onChange={handleInputChange} />
                    </div>
                </div>
                
                
                <button type="button" className="btn btn-primary" onClick={handleAddFood}>Agregar Alimento</button>
            </form>
            
            <table className="table mt-4">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Proteínas</th>
                    <th>Carbohidratos</th>
                    <th>Grasas</th>
                </tr>
                </thead>
                <tbody>
                {foods.map((food, index) => (
                    <tr key={index}>
                    <td>{food.nombre}</td>
                    <td>{food.categoria}</td>
                    <td>{food.proteinas}</td>
                    <td>{food.carbohidratos}</td>
                    <td>{food.grasas}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
            {foods.length > 0 && (
                <button type="button" className="btn btn-success" onClick={handleSaveFoods}>Guardar Alimentos</button>
            )}
        </>
        ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )}
    </div>        
  );
};

export default AddFoodForm;
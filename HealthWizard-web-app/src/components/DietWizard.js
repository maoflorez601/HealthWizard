import React, { useState, useEffect } from 'react'
import { getAuth } from "firebase/auth";

//importaciones de estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { Modal, Button } from 'react-bootstrap'; // Importa el componente Modal y Button de react-bootstrap

//importaciones para db firestore
import { collection, query, where, getDocs } from 'firebase/firestore'; // Importa los métodos necesarios de Firestore para realizar consultas
import { db } from '../firebaseConfig/firebase'




const DietWizard = () => {

    const [user, setUser] = useState(null);
    const auth = getAuth();

    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [mealType, setMealType] = useState(''); // Estado para almacenar el tipo de comida
    const [modalKey, setModalKey] = useState(0); // Estado para el identificador único del modal

    const handleOpenModal = (meal) => {
        setMealType(meal);
        setShowModal(true);
        setModalKey(prevKey => prevKey + 1); // Incrementa el identificador único para forzar la creación de un nuevo modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalKey(0); // Restablece el identificador único para eliminar el modal existente
    };   
  

    const [selectedDay, setSelectedDay] = useState('lunes');
    const [mealPlan, setMealPlan] = useState({
        desayuno: [],
        almuerzo: [],
        cena: [],
        aperitivos: []
    });
    
    const handleDayChange = (day) => {
        setSelectedDay(day);
    };


    const handleAddFood = () => {
        // Aquí puedes agregar la lógica para agregar alimentos
        // Puedes utilizar el estado mealType para determinar qué tipo de comida se está agregando
        // Por ejemplo, puedes llamar a una función para agregar alimentos a la lista correspondiente
    };

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

    const [selectedCategory, setSelectedCategory] = useState('');
    const [foods, setFoods] = useState([]); // Estado para almacenar la lista de alimentos según la categoría seleccionada
    
    const [selectedFood, setSelectedFood] = useState(null);
    

    const [listSelectedFoods, setListSelectedFoods] = useState([]);

    //funcion para agregar nuevas comidas
    const addSelectedFood = () => {
        if (selectedFood) {
            setListSelectedFoods([...listSelectedFoods, selectedFood]);
        // Limpiar la selección de patología después de agregarla a la lista
        setSelectedFood('');
        }

        console.log("Alimento seleccionado: " + selectedFood.nombre + ", proteina: " + selectedFood.proteinas);
    };

    // Función para agregar un nuevo alimento
    const addFood = (newFood) => {
        setFoods(prevFoods => [...prevFoods, newFood]); // Agrega el nuevo alimento al array
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setSelectedCategory(value);
        // Aquí puedes hacer la consulta a la base de datos para obtener la lista de alimentos según la categoría seleccionada
        // Por ahora, simularemos la consulta con un conjunto de alimentos de ejemplo
        // Supongamos que tienes un array de alimentos por categoría llamado "foodsData"
        // const foodsData = {
        //     categoria1: ['Alimento 1', 'Alimento 2', 'Alimento 3'],
        //     categoria2: ['Alimento 4', 'Alimento 5', 'Alimento 6'],
        //     // Agrega más categorías y alimentos según sea necesario
        // };
        // setFoods(foodsData[value] || []);
    };
    
    const handleFoodChange = (e) => {
        const selectedFoodObject = foods.find(food => food.nombre === e.target.value);
        setSelectedFood(selectedFoodObject); // Asigna el objeto food completo como selectedFood
    };


    // Función para calcular el total de calorías, grasas, carbohidratos y proteínas
    const calculateTotals = () => {
        let totalCalories = 60;
        let totalFat = 56;
        let totalCarbs = 20;
        let totalProtein = 78;

        Object.values(mealPlan).forEach(meal => {
            meal.forEach(foodItem => {
                totalCalories += foodItem.calories;
                totalFat += foodItem.fat;
                totalCarbs += foodItem.carbs;
                totalProtein += foodItem.protein;
            });
        });

        return {
            totalCalories,
            totalFat,
            totalCarbs,
            totalProtein
        };
    };

    const { totalCalories, totalFat, totalCarbs, totalProtein } = calculateTotals();


    useEffect(() => {
        const fetchFoods = async () => {
            if (selectedCategory !== '') {
                const foodsRef = collection(db, 'foods'); // 'foods' es el nombre de tu colección en Firestore
                console.log("categoria seleccionada: " + selectedCategory)
                const q = query(foodsRef, where('categoria', '==', selectedCategory)); // Filtra los alimentos por categoría
                

                try {
                    const querySnapshot = await getDocs(q);
                    // const foodsData = [];
                    querySnapshot.forEach((doc) => {
                        //foodsData.push(doc.data().nombre);

                        //parametros que tiene el cada registro de comida
                        const newFood = { 
                            proteinas: doc.data().proteinas, 
                            categoria: doc.data().categoria, 
                            nombre: doc.data().nombre,
                            grasas: doc.data().grasas, 
                            carbohidratos: doc.data().carbohidratos 
                          };
                          addFood(newFood);
                    });
                    //setFoods(foodsData);
                } catch (error) {
                    console.error('Error al obtener alimentos:', error);
                }
            } else {
                setFoods([]); // Reinicia la lista de alimentos si no hay una categoría seleccionada
            }
        };

        fetchFoods();

        const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
            setUser(user);
            });        
        // eslint-disable-next-line
        return () => unsubscribe(); // Limpia el observador cuando el componente se desmonta
    }, [selectedCategory])

  return (
    
    <div className='container'>       
        {user ? (
            <>
            <h1>Controlador de Calorías en la Comida</h1>
            <div>
                <select value={selectedDay} onChange={(e) => handleDayChange(e.target.value)}>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miércoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
                </select>
            </div>

            <div className="border p-3 mb-4">
                <h2>Conteo Total</h2>
                <p>Total de Calorías: {totalCalories}</p>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${totalCalories}%` }} aria-valuenow={totalCalories} aria-valuemin="0" aria-valuemax="100">Calorias: {totalCalories}%</div>
                <span>Total Grasas</span>
                <div className="progress" style={{ height: '30px' }}>                    
                    <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${totalFat}%` }} aria-valuenow={totalFat} aria-valuemin="0" aria-valuemax="100">Grasas: {totalFat}%</div>
                </div>
                <span>Total Carbohidratos</span>
                <div className="progress mt-2" style={{ height: '30px' }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${totalCarbs}%` }} aria-valuenow={totalCarbs} aria-valuemin="0" aria-valuemax="100">Carbohidratos: {totalCarbs}%</div>
                </div>
                <span>Total Total Proteinas</span>
                <div className="progress mt-2" style={{ height: '30px' }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${totalProtein}%` }} aria-valuenow={totalProtein} aria-valuemin="0" aria-valuemax="100">Proteínas: {totalProtein}%</div>
                </div>
            </div>

            <div className="border p-3 mb-4">
                <h2>Desayuno</h2>
                <button className="btn btn-outline-custom" onClick={() => handleOpenModal('desayuno')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>                                     
                {/* Componente de lista de alimentos para el desayuno */}
                {/* Puedes crear un componente separado para esto */}    
                <div className="col-md-8 text-start">
                    <ul className="list-unstyled">
                        {listSelectedFoods.map((food, index) => (
                            <span key={index} className="badge bg-primary me-2 mb-2">{food.nombre} | Proteinas: {food.proteinas} | Carbohidratos: {food.carbohidratos} | Grasas: {food.grasas}</span>
                        ))}
                    </ul>
                </div>              
            </div>

            <div className="border p-3 mb-4">
                <h2>Almuerzo</h2>
                <button className="btn btn-outline-custom" onClick={() => handleOpenModal('almuerzo')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>  
            {/* Componente de lista de alimentos para el almuerzo */}
            </div>

            <div className="border p-3 mb-4">
                <h2>Cena</h2>
                <button className="btn btn-outline-custom" onClick={() => handleOpenModal('cena')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>  
                {/* Componente de lista de alimentos para la cena */}
            </div>

            <div className="border p-3 mb-4">
                <h2>Aperitivos</h2>
                <button className="btn btn-outline-custom" onClick={() => handleOpenModal('aperitivos')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>  
                {/* Componente de lista de alimentos para los aperitivos */}
            </div>
            
            </>
            ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )        
        }
         {/* Modal para agregar alimentos */}
         {showModal && (
            <Modal show={showModal} key={modalKey} onClose={handleCloseModal}>
                <Modal.Header closeButton>
                <Modal.Title>Agregar Alimento a {mealType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="categorySelect" className="form-label">Seleccionar Categoría:</label>
                        <select id="categorySelect" className="form-select" value={selectedCategory} onChange={handleCategoryChange}>
                        <option value="">Seleccionar Categoría</option>
                                {food_categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="foodSelect" className="form-label">Seleccionar Alimento:</label>
                        <select id="foodSelect" className="form-select" value={''} onChange={ handleFoodChange }>
                            {/* {foods.length == 0 ? <option value="">Seleccionar Alimento</option> : null } (e) => setSelectedFood(e.target.value*/}
                            <option value="">Seleccionar Alimento</option>
                            {foods.map((food, index) => (
                                <option key={index} value={food.nombre}>{food.nombre} | Proteinas: {food.proteinas} | Carbohidratos: {food.carbohidratos} | Grasas: {food.grasas}</option>
                            ))}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={addSelectedFood}>
                Agregar
                </Button>
                {/* Agrega un botón para realizar alguna acción dentro del modal si es necesario */}
                </Modal.Footer>
            </Modal>
        )}
    </div>
  )
}

export default DietWizard
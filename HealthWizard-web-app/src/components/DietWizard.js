import React, { useState, useEffect } from 'react'
import { getAuth } from "firebase/auth";

//importaciones de estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { Modal, Button } from 'react-bootstrap'; // Importa el componente Modal y Button de react-bootstrap
import Swal from 'sweetalert2';
import ProgressBar from 'react-bootstrap/ProgressBar'; //estilos de barras de progreso

//importaciones para db firestore
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'; // Importa los métodos necesarios de Firestore para realizar consultas
import { db } from '../firebaseConfig/firebase'

//importanciones para calendario
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const DietWizard = () => {

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

    const [user, setUser] = useState(null);
    const auth = getAuth();

    //hook para manejar el modal que permite seleccionar tipo de comida y comida
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [mealType, setMealType] = useState(''); // Estado para almacenar el tipo de comida
    const [modalKey, setModalKey] = useState(0); // Estado para el identificador único del modal


    const [selectedDate, setSelectedDate] = useState(new Date());    
    
    const [foods, setFoods] = useState([]); // Hook para almacenar la lista de alimentos según la categoría seleccionada
    const [diets, setDiets] = useState([]); // Hook  para almacenar la informacion de dietas del usuario
    
    const [selectedCategory, setSelectedCategory] = useState(''); //almacena la categoria de alimentos seleccionada
    const [selectedFood, setSelectedFood] = useState(null); //hook para agregar nueva comida al plan alimenticio

    const [listBreakfast, setListBreakfast] = useState([]); //lista de comidas al desayuno
    const [listLunch, setListLunch] = useState([]); //lista de comidas al almuerzo
    const [listDinner, setListDinner] = useState([]); //lista de comidas a la cena
    const [listSnacks, setListSnacks] = useState([]); //lista de comidas de aperitivo

    //hooks para calcular los totales dieteticos
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFat, setTotalFat] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);

    const handleOpenModal = (meal) => {
        setMealType(meal);
        setShowModal(true);
        setModalKey(prevKey => prevKey + 1); // Incrementa el identificador único para forzar la creación de un nuevo modal
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalKey(0); // Restablece el identificador único para eliminar el modal existente
    };

    //funcion para agregar comidas en el cuadro de seleccion de alimentos después de seleccionar la categoria deseada
    const loadFoods = async () => {
        if (selectedCategory !== '') {
            const foodsRef = collection(db, 'foods'); // 'foods' es el nombre de tu colección en Firestore
            //console.log("categoria seleccionada: " + selectedCategory)
            const q = query(foodsRef, where('categoria', '==', selectedCategory)); // Filtra los alimentos por categoría
            
            //se vacia la lista de foods para que no se acumule la lista de alimentos en el cuadro de seleccion de alimentos
            setFoods([]);

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

    //funcion para cargar el perfil de dieta del usuario
    const fetchDiets = async () => {
        try {     
            // Obtener la fecha de inicio del día seleccionado
            const startOfDay = new Date(selectedDate);
            startOfDay.setHours(0, 0, 0, 0);

            // Obtener la fecha de finalización del día seleccionado
            const endOfDay = new Date(selectedDate);
            endOfDay.setHours(23, 59, 59, 999);


            // Obtener la colección "diets" filtrada por el usuario actual y fecha seleccionada
            const q = query(
                collection(db, 'diets'), 
                //where('email_client', '==', user.email),
                where('date', '>=', startOfDay),
                where('date', '<=', endOfDay)
            );

            const querySnapshot = await getDocs(q);

            // Mapear los documentos y extraer los datos de cada dieta
            const fetchedDiets = await Promise.all(querySnapshot.docs.map(async doc => {
                const dietData = doc.data();
                // Obtener la subcolección "foods" para cada dieta
                const foodsRef = collection(db, 'diets', doc.id, 'foods');
                const foodsSnapshot = await getDocs(foodsRef);

                let proteins = 0;
                let carbs = 0;
                let fat = 0;
                
                const foods = foodsSnapshot.docs.map(foodDoc => {
                    //console.log(foodDoc.data().carbohidratos);

                    //Procedimiento para calcular los totales de proteinas, carbohidratos, grasas y calorias
                    proteins += Number(foodDoc.data().proteinas);
                    carbs += Number(foodDoc.data().carbohidratos);
                    fat += Number(foodDoc.data().grasas);

                    //console.log("proteins: "+ proteins);      
                    return {
                        id: foodDoc.id,
                        ...foodDoc.data()
                    }                    
                });

                //Formula para calcular calorias    
                let calories = (proteins * 4) + (carbs * 4) + (fat * 9);

                //calculo de totales mostrados en pantalla
                setTotalProtein(proteins);
                setTotalCarbs(carbs);
                setTotalFat(fat);
                setTotalCalories(calories);

                //console.log("calorias totales: " + totalCalories);

                //al final retorna los campos de dieta junto con la coleccion de foods
                return { id: doc.id, ...dietData, foods };
            }));

            // Actualizar el estado con las dietas recuperadas
            setDiets(fetchedDiets);          

        } catch (error) {
            console.error('Error al recuperar las dietas:', error);
        }
    };



    //funcion para agregar nuevas comidas por tipo de comida
    const addSelectedFood = () => {
        const foodWithMealType = { ...selectedFood, mealType: mealType }; //se crea variable para agregar el tipo de comida a la lista

        if (selectedFood && mealType === "desayuno") {            
            setListBreakfast([...listBreakfast, foodWithMealType]);
            //console.log(listBreakfast);       
        }

        if (selectedFood && mealType === "almuerzo") {
            setListLunch([...listLunch, foodWithMealType]);       
        }

        if (selectedFood && mealType === "cena") {
            setListDinner([...listDinner, foodWithMealType]);       
        }

        if (selectedFood && mealType === "aperitivos") {
            setListSnacks([...listSnacks, foodWithMealType]);       
        }

        // Limpiar la selección de comida después de agregarla a la lista
        setSelectedFood('');

        //console.log("Alimento seleccionado: " + selectedFood.nombre + ", proteina: " + selectedFood.proteinas);
    };

    // Función para agregar un nuevo alimento
    const addFood = (newFood) => {
        setFoods(prevFoods => [...prevFoods, newFood]); // Agrega el nuevo alimento al array
    };

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setSelectedCategory(value);
    };
    
    const handleFoodChange = (e) => {
        const selectedFoodObject = foods.find(food => food.nombre === e.target.value);
        setSelectedFood(selectedFoodObject); // Asigna el objeto food completo como selectedFood
    };

    // Guardar lista de patologías en BD Firestore
    const saveDietProfile = async () => {
        try { 
            
            const dietsCollection = collection(db, 'diets');
            console.log("email del usuario: " + user.email)

            // agrega un nuevo elemento a la colección diets (aún no se agregan la lista de comidas)
            const newDocRef = await addDoc(dietsCollection, {
                email_client: user.email,
                date: selectedDate,
            });

            //obtener id de elemento creado
            const dietDocId = newDocRef.id;

            // se concatenan todas las listas de comidas en una única lista
            const allFoods = [...listBreakfast, ...listLunch, ...listDinner, ...listSnacks];

            // Agregar cada elemento de allFoods a la subcolección 'foods' en el documento recién creado
            await Promise.all(allFoods.map(async (foodItem) => {
                const foodsCollectionRef = collection(db, `diets/${dietDocId}/foods`);
                await addDoc(foodsCollectionRef, foodItem);
            }));

            Swal.fire("Perfil de dieta actualizado exitosamente.","Perfil Dieta Usuario","success");                
            console.log('Lista de dietas actualizada en Firestore');
            //navigate('/Show')

        } catch (error) {
        console.error('Error al actualizar informacion de dietas en Firestore:', error);
        }
    };


    useEffect(() => {

        fetchDiets(); //cargar el perfil de dieta del usuario en la fecha seleccionada 

        const unsubscribe = auth.onAuthStateChanged((user) => { //manejo de sesión activa
            setUser(user);
            });        

               

        //loadFoods(); //para agregar comidas a la categoria seleccionada

        
        //eslint-disable-next-line
        return () => {
            unsubscribe(); // Limpia el observador cuando el componente se desmonta
        }       
    }, [selectedCategory]); //selectedCategory

    
  return (
    
    <div className='container'>       
        {user ? (
            <>
            <h1 className='text-success'>DietWizard</h1>      

            <div className="row align-items-center">
                <div className="col-md-3 my-2 text-end">
                    <h2>Dia de registro</h2>
                </div>
                <div className="col-md-2">
                    <   DatePicker
                        showIcon
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                    />
                </div>
                <div className="col-md-3 my-2 text-end">
                <button className="btn btn-primary" onClick={ saveDietProfile }>Guardar cambios</button>  
                </div>
            </div>
            <div className="border p-3 mb-4 ">            
                {/* <div className="progress" style={{ height: '30px' }}>
                <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${(totalCalories / 1000) * 100}%` }} aria-valuenow={totalCalories} aria-valuemin="0" aria-valuemax="1000">Calorias: {totalCalories}</div>
                </div> */}
                <h2>Conteo Total</h2>
                
                <div className="row align-items-center">
                    <div className="col-md-2 my-2 text-end">
                        <span style={{ fontWeight: 'bold' }}>Total Calorias</span>
                    </div>
                    <div className="col-md-5">
                        <ProgressBar animated variant="danger" 
                            now={(totalCalories / 1000) * 100} 
                            label={<span style={{ fontWeight: 'bold' }}>{totalCalories}</span>}
                        />
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-2 my-2 text-end">
                        <span style={{ fontWeight: 'bold' }}>Total Proteínas </span>
                    </div>
                    <div className="col-md-5">
                        <ProgressBar animated variant="success" 
                            now={totalProtein} 
                            label={<span style={{ fontWeight: 'bold' }}>{totalProtein}</span>}
                        /> 
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-2 my-2 text-end">
                        <span style={{ fontWeight: 'bold' }}>Total Carbohidratos </span>
                    </div>
                    <div className="col-md-5">
                        <ProgressBar animated variant="dark" 
                            now={totalCarbs} 
                            label={<span style={{ fontWeight: 'bold' }}>{totalCarbs}</span>}
                        /> 
                    </div>
                </div>

                <div className="row align-items-center">
                    <div className="col-md-2 my-2 text-end">
                        <span style={{ fontWeight: 'bold' }}>Total Grasas </span>
                    </div>
                    <div className="col-md-5">
                        <ProgressBar animated variant="warning" 
                            now={totalFat} 
                            label={<span style={{ color: 'crimson', fontWeight: 'bold' }}>{totalFat}</span>}
                        /> 
                    </div>
                </div>     

            </div>

            {Array.isArray(diets) ? (diets.map((diet) => (          
                <div key={diet.id}>
                    <div className="border p-3 mb-4">
                        <h2>Desayuno</h2>
                        <button className="btn btn-outline-custom" onClick={() => handleOpenModal('desayuno')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>
                        {/* <p><strong>ID:</strong> {diet.id}</p> */}
                        {/* <p><strong>Fecha:</strong> {diet.date}</p> */}
                        <div className="col-md-8 text-start">
                            <ul className="list-unstyled d-flex flex-wrap">
                                {diet.foods.map((food) => (
                                    food.mealType === 'desayuno' ? (
                                    <div key={food.id} className="card mb-2 bg-transparent border-warning text-info">
                                        <div className="card-body">
                                            <h5 className="card-title text-warning">{food.nombre}</h5>
                                            <p className="card-text">Proteínas: {food.proteinas}</p>
                                            <p className="card-text">Carbohidratos: {food.carbohidratos}</p>
                                            <p className="card-text">Grasas: {food.grasas}</p>
                                        </div>                                    
                                    </div>
                                ) : null
                                ))}
                            </ul>
                        </div> 
                    </div>

                    <div className="border p-3 mb-4">
                        <h2>Almuerzo</h2>
                        <button className="btn btn-outline-custom" onClick={() => handleOpenModal('almuerzo')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>
                        {/* <p><strong>ID:</strong> {diet.id}</p> */}
                        {/* <p><strong>Fecha:</strong> {diet.date}</p> */}
                        <div className="col-md-8 text-start">
                            <ul className="list-unstyled d-flex flex-wrap">
                                {diet.foods.map((food) => (
                                    food.mealType === 'almuerzo' ? (
                                    <div key={food.id} className="card mb-2 bg-transparent border-warning text-info">
                                        <div className="card-body">
                                            <h5 className="card-title text-warning">{food.nombre}</h5>
                                            <p className="card-text">Proteínas: {food.proteinas}</p>
                                            <p className="card-text">Carbohidratos: {food.carbohidratos}</p>
                                            <p className="card-text">Grasas: {food.grasas}</p>
                                        </div>                                    
                                    </div>
                                ) : null
                                ))}
                            </ul>
                        </div> 
                    </div>  

                    <div className="border p-3 mb-4">
                        <h2>Cena</h2>
                        <button className="btn btn-outline-custom" onClick={() => handleOpenModal('cena')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>
                        {/* <p><strong>ID:</strong> {diet.id}</p> */}
                        {/* <p><strong>Fecha:</strong> {diet.date}</p> */}
                        <div className="col-md-8 text-start">
                            <ul className="list-unstyled d-flex flex-wrap">
                                {diet.foods.map((food) => (
                                    food.mealType === 'cena' ? (
                                    <div key={food.id} className="card mb-2 bg-transparent border-warning text-info">
                                        <div className="card-body">
                                            <h5 className="card-title text-warning">{food.nombre}</h5>
                                            <p className="card-text">Proteínas: {food.proteinas}</p>
                                            <p className="card-text">Carbohidratos: {food.carbohidratos}</p>
                                            <p className="card-text">Grasas: {food.grasas}</p>
                                        </div>                                    
                                    </div>
                                ) : null
                                ))}
                            </ul>
                        </div> 
                    </div>                                    
                </div>                
                
            ))) : (<p>No hay datos de dietas disponibles.</p>)}              

            {/* <div className="border p-3 mb-4">
                <h2>Aperitivos</h2>
                <button className="btn btn-outline-custom" onClick={() => handleOpenModal('aperitivos')}><FontAwesomeIcon icon={faSquarePlus} size="3x" /></button>  
                <div className="col-md-8 text-start">
                    <ul className="list-unstyled">
                        {listSnacks.map((food, index) => (                            
                            <div key={index} className="card mb-2 bg-transparent border-warning text-info">
                            <div className="card-body">
                              <h5 className="card-title text-warning">{food.nombre}</h5>
                              <p className="card-text">Proteínas: {food.proteinas}</p>
                              <p className="card-text">Carbohidratos: {food.carbohidratos}</p>
                              <p className="card-text">Grasas: {food.grasas}</p>
                            </div>
                          </div>
                        ))}
                    </ul>
                </div> 
            </div> */}
            
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
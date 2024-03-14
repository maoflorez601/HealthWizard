import React, { useState, useEffect } from 'react'

import { getAuth } from "firebase/auth";

const DietWizard = () => {

    const [user, setUser] = useState(null);
    const auth = getAuth();

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

    const handleAddFood = (mealType, foodItem) => {
        setMealPlan(prevMealPlan => ({
        ...prevMealPlan,
        [mealType]: [...prevMealPlan[mealType], foodItem]
        }));
    };

    // Función para calcular el total de calorías, grasas, carbohidratos y proteínas
    const calculateTotals = () => {
        let totalCalories = 0;
        let totalFat = 0;
        let totalCarbs = 0;
        let totalProtein = 0;

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
            <div>
                <h2>Desayuno</h2>
                {/* Componente de lista de alimentos para el desayuno */}
                {/* Puedes crear un componente separado para esto */}
            </div>

            <div>
                <h2>Almuerzo</h2>
                {/* Componente de lista de alimentos para el almuerzo */}
            </div>

            <div>
                <h2>Cena</h2>
                {/* Componente de lista de alimentos para la cena */}
            </div>

            <div>
                <h2>Aperitivos</h2>
                {/* Componente de lista de alimentos para los aperitivos */}
            </div>
            <div>
                <h2>Conteo Total</h2>
                <p>Total de Calorías: {totalCalories}</p>
                <p>Total de Grasas: {totalFat}</p>
                <p>Total de Carbohidratos: {totalCarbs}</p>
                <p>Total de Proteínas: {totalProtein}</p>
            </div>
            </>
            ) : ( <h1 className='text-danger'>Inicie sessión para acceder a este contenido</h1> )        
        };
    </div>
  )
}

export default DietWizard
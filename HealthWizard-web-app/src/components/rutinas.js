import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addExerciseToFirestore } from '../firebaseConfig/firestore';

const AddExercise = () => {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseReps, setExerciseReps] = useState('');
    const [exerciseDescription, setExerciseDescription] = useState('');

    const addExercise = async (e) => {
        e.preventDefault();

        try {
            // Verificar si el número de repeticiones es un número válido
            if (isNaN(exerciseReps)) {
                throw new Error('El número de repeticiones debe ser un número válido.');
            }

            // Guardar el ejercicio en Firestore
            await addExerciseToFirestore({
                name: exerciseName,
                reps: parseInt(exerciseReps),
                description: exerciseDescription
            });

            // Limpiar los campos del formulario después de agregar el ejercicio
            setExerciseName('');
            setExerciseReps('');
            setExerciseDescription('');

            // Mostrar mensaje de éxito
            Swal.fire('Ejercicio agregado correctamente', '', 'success');
        } catch (error) {
            // Mostrar mensaje de error si ocurre algún problema
            Swal.fire('Error al agregar ejercicio', error.message, 'error');
            console.error('Error al agregar ejercicio:', error);
        }
    };

    return (
        <div className="container">
            <div className="exercise-form">
                <div className="main-div">
                    <div className="panel">
                        <h2>Agregar Ejercicio</h2>
                        <p>Por favor complete los campos para agregar un nuevo ejercicio.</p>
                    </div>
                    <form onSubmit={addExercise}>
                        <div className="mb-3">
                            <label className="form-label">Nombre del ejercicio</label>
                            <input
                                value={exerciseName}
                                onChange={(e) => setExerciseName(e.target.value)}
                                type="text"
                                className="form-control"
                                placeholder="Nombre del ejercicio"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Número de repeticiones</label>
                            <input
                                value={exerciseReps}
                                onChange={(e) => setExerciseReps(e.target.value)}
                                type="number"
                                className="form-control"
                                placeholder="Número de repeticiones"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción del ejercicio</label>
                            <textarea
                                value={exerciseDescription}
                                onChange={(e) => setExerciseDescription(e.target.value)}
                                className="form-control"
                                placeholder="Descripción del ejercicio"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Agregar Ejercicio</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExercise;

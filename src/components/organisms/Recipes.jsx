import React, { createContext, useContext, useState } from 'react';
import WhiteButton from '../atoms/buttons/WhiteButton';
import NewRecipeModal from '../molecules/formsAndModals/NewRecipeModal';
import AddIngredientModal from '../molecules/formsAndModals/AddIngredientModal';
import CustomizedTable from '../molecules/CustomizedTable';
import AddIngredientToRecipe from '../molecules/formsAndModals/AddIngredientToRecipe';
import { useNavigate } from 'react-router-dom';
import { appContext } from '../../App';
import { ConfirmModalAddIngredientsToRecipe } from '../molecules/formsAndModals/ConfirmModalAddIngredientsToRecipe';

export const recipesContext = createContext(null);

const Recipes = () => {

    const [showRecipeDetailById, setShowRecipeDetailById] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModalAddRecipe, setShowModalAddRecipe] = useState(false);
    const [showModalAddIngredient, setShowModalAddIngredient] = useState(false);
    const [showModalAddIngredientToRecipe, setShowModalAddIngredientToRecipe] = useState(false);
    const navigate = useNavigate();
    const { userData, fetchData } = useContext(appContext);
    const ingredients = userData && userData.userIngredients;
    const recipes = userData && userData.userRecipes;
    const [showPopUpModal, setShowPopUpModal] = useState(false);
    const [recipeId, setRecipeId] = useState('')

    const handleShowModalAddIngredientToRecipe = (recipeId) => {
        setRecipeId(recipeId)
        setShowModalAddIngredientToRecipe(true)
    }

    const setNewErrorMessage = (errorMessage) => {
        setErrorMessage(errorMessage)
        setTimeout(() => {
            setErrorMessage('')
        }, 10000);
    }

    const setNewSuccessMessage = (successMessage) => {
        setSuccessMessage(successMessage)
        setTimeout(() => {
            setSuccessMessage('')
        }, 10000);
    }
    
    
    const handleEditRecipe = async (editingValues) => {
        const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://localhost:3001/api/edit-a-recipe-and-recipe-details', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify({ editingValues }),
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    await fetchData()
                    setNewSuccessMessage(data.successMessage)
                } else {
                    setNewErrorMessage(data.errorMessage)
                }
            } catch (err) {
                setNewErrorMessage('Server error')
            }
    };


    const handleSubmitAddRecipe = async (formDataAddRecipe) => {
        const token = localStorage.getItem('token')
            try {
                const response = await fetch('http://localhost:3001/api/create-new-recipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(formDataAddRecipe),
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    await fetchData()
                    setNewSuccessMessage(data.successMessage)
                } else {
                    setNewErrorMessage(data.errorMessage)
                }
            } catch (err) {
                setNewErrorMessage('Server error')
            }
    };        

    const handleSubmitAddIngredient = async (newIngredient) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3001/api/create-new-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newIngredient),
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                fetchData();
                setShowModalAddIngredient(false)
                setNewSuccessMessage(data.successMessage)
            } else {
                setNewErrorMessage(data.errorMessage)
            }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
    };


        const handleDeleteRecipe = async (recipeId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3001/api/delete-a-recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ recipeId }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                fetchData();
                setNewSuccessMessage(data.successMessage)
            } else {
                setNewErrorMessage(data.errorMessage)
            }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
    };


    const handleDeleteRecipeDetailIngredient = async (recipeDetailId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3001/api/delete-recipe-detail-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ recipeDetailId }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                fetchData();
                setNewSuccessMessage(data.successMessage)
            } else {
                setNewErrorMessage(data.errorMessage)
            }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
    };


    // TODO: AL IR AL HOME ME HACE NUEVAMENTE LA CONSULTA. VERIFICAR ESO
    // const getAllRecipesByToken = async (token) => {
    //     setGettingRecipesMessage(true);
    //     try {
    //         const response = await fetch('http://localhost:3001/api/get-all-recipes', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': token
    //             },
    //         });
    //         setGettingRecipesMessage(false);
    //         const data = await response.json();
    //         if (response.ok && data.success) {
    //             // setRecipes(data.Recipes);
    //         } else {
    //             const { status, redirectTo, errorMessage } = data;
    //             if (status === 401 && redirectTo) {
    //               // Redirigir a la URL proporcionada en la respuesta
    //             window.location.href = redirectTo;
    //             }
    //             setNewErrorMessage(errorMessage)
    //         }
    //     } catch (error) {
    //         setNewErrorMessage('Server error')
    //     }};

        // const getAllIngredientsByToken = async (token) => {
        //     try {
        //         const response = await fetch('http://localhost:3001/api/get-all-ingredients', {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': token
        //             },
        //         });
        //         const data = await response.json();
        //         if (response.ok && data.success) {
        //             // setIngredients(data.Ingredients);
        //         } else {
        //             setNewErrorMessage(data.errorMessage)
        //         }
        //     } catch (error) {
        //         setNewErrorMessage('Server error')
        //     }};

                        
            const [filteredIngredients, setFilteredIngredients] = useState([]);


            const handleAddIngredientsShowPopUpModal = async (selectedIngredients) => {
                
                // Filtrar los elementos que tienen una cantidad no vacía
                const checkIngredients = selectedIngredients.filter(ingredient => {
                    return ingredient.quantity !== '';
                });
            
                if (checkIngredients && checkIngredients.length > 0) {
                    setFilteredIngredients(checkIngredients)
                    setShowPopUpModal(true)
                }
                else {
                    setNewErrorMessage("Selecciona algun ingrediente e ingresa una cantidad")
                }
            };


            const handleAddIngredientsToRecipe = async () => {
                const token = localStorage.getItem('token')
                try {
                    const response = await fetch('http://localhost:3001/api/add-ingredients-to-recipe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': token
                        },
                        body: JSON.stringify({filteredIngredients, recipeId}),
                    });

                    const data = await response.json();
                    if (response.ok && data.success) {
                        fetchData();
                        setShowModalAddIngredientToRecipe(false)
                        setNewSuccessMessage(data.successMessage)
                    } else {
                        setNewErrorMessage(data.errorMessage)
                    }
                    // handleCloseModalAddIngredient()
                } catch (err) {
                    setNewErrorMessage('Server error')
                }
            }

        // TODO: VER COMO MOSTRAR LOS DATOS. QUIZA HAY QUE HACE UN MAP DENTRO DE OTRO MAP O VER QUE OPCION ES MEJOR.
    const RecipeList = () => {
        return (
            <div>
            <div className='mainBoxRecipes'>
                <div onClick={() => setShowModalAddRecipe(true)}>
                    <WhiteButton>Add new recipe</WhiteButton>
                </div>
                <div onClick={ () => navigate('/ingredients')}>
                    <WhiteButton>Manage ingredients</WhiteButton>
                </div>
            </div>
            <div className='box'>
            {recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
                <div key={recipe.recipeId}>
                    <CustomizedTable recipe={recipe} showDetails={recipe.showDetails} />
                </div>
                ))
            ) : (
                <h4 className='h4Text'>There are not recipes to show.</h4>
            )}
</div>
</div>
        );
        };

        if (!ingredients && !recipes) {
            return (
                <div className='gettingMessage'>Getting recipes. Please wait</div>
            )
        }

        return (
            <recipesContext.Provider
            value={{
                showModalAddRecipe,
                setShowModalAddRecipe,
                handleSubmitAddIngredient,
                showModalAddIngredientToRecipe,
                handleShowModalAddIngredientToRecipe,
                handleSubmitAddRecipe,
                successMessage,
                errorMessage,
                setShowPopUpModal,
                showPopUpModal,
                handleAddIngredientsToRecipe,
                handleAddIngredientsShowPopUpModal,
                setShowModalAddIngredientToRecipe,
                showRecipeDetailById,
                setShowModalAddIngredient,
                showModalAddIngredient,
                setShowRecipeDetailById,
                handleDeleteRecipe,
                handleEditRecipe,
                handleDeleteRecipeDetailIngredient,
            }}
            >

                <>
            <div className='errorMessage'>{errorMessage}</div>
            <div className='successMessage'>{successMessage}</div>
                <div className='topRecipesBottonsContainer'>
                    <NewRecipeModal />
                    <AddIngredientModal showModalAddIngredient={showModalAddIngredient} setShowModalAddIngredient={setShowModalAddIngredient}/>
                    {showModalAddIngredientToRecipe && (
                    <AddIngredientToRecipe 
                        ingredients={ingredients}
                    />
                    )}
                    {showPopUpModal && (
                    <ConfirmModalAddIngredientsToRecipe
                        filteredIngredients={filteredIngredients}
                    />
                    )}
                    <RecipeList />
                </div>
                </>
            </recipesContext.Provider>
        );
    };
        
export default Recipes;

import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { recipesContext } from '../../organisms/Recipes';
import { FaLongArrowAltRight } from 'react-icons/fa';

export const ConfirmModalEditRecipe = ({
    editingValues,
    originalValues,
    showModalConfirmEditRecipe,
    setShowModalConfirmEditRecipe}) => {

    const [disabled, setDisabled] = useState(false);

    const checkingIngredientQuantity = originalValues.recipeDetail.some((item, index) => {
        return item.ingredientQuantity !== editingValues.recipeDetail[index].ingredientQuantity;
    });
    const checkRecipeName = originalValues.name !== editingValues.name
    const checkRecipeProduction = originalValues.production !== editingValues.production
    const checkRecipeDescription = originalValues.description !== editingValues.description

    useEffect(() => {
        console.log(checkingIngredientQuantity)
        console.log(checkRecipeName)
        console.log(checkRecipeProduction)
        if (checkingIngredientQuantity || checkRecipeName || checkRecipeProduction || checkRecipeDescription) {
            setDisabled(false)
            } else {
                setDisabled(true)
            }
    }, [checkingIngredientQuantity, checkRecipeName, checkRecipeProduction, checkRecipeDescription]);

    const { handleEditRecipe } = useContext(recipesContext)

    const handleConfirmButton = () => {
        setShowModalConfirmEditRecipe(false)
        handleEditRecipe(editingValues)
    }

    return (
        <>
            <Modal size='lg' show={showModalConfirmEditRecipe} onHide={() => setShowModalConfirmEditRecipe(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Are you sure that you want to edit this recipe data?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
    <div className='recipeEditBoxComparation'>
        {
            originalValues.name === editingValues.name ? (
                <div className='editRecipeComparationBoxEqual'>
                    <div className='columnaOcupa1Lugar'>
                        <h5>Recipe Name</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{originalValues.name}</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.name}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='editRecipeComparationBoxDifferent'>
                    <div className='columnaOcupa1Lugar'>
                        <h5>Recipe Name</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{originalValues.name}</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.name}</p>
                        </div>
                    </div>
                </div>
            )}

            {
            originalValues.description === editingValues.description ? (
                <div className='editRecipeComparationBoxEqual'>
                    <div className='columnaOcupa1Lugar'>
                        <h5>Recipe description</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{originalValues.description ? originalValues.description : 'No description'}</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.description ? editingValues.description : 'No description'}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='editRecipeComparationBoxDifferent'>
                    <div className='columnaOcupa1Lugar'>
                        <h5>Recipe description</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                        <p>{originalValues.description ? originalValues.description : 'No description'}</p>
                            <FaLongArrowAltRight />
                        <p>{editingValues.description ? editingValues.description : 'No description'}</p>
                        </div>
                    </div>
                </div>
            )}

            {
            originalValues.production === editingValues.production ? (
                <div className='editRecipeComparationBoxEqual'>
                    <div className='columnaOcupa1Lugar'>
                        <h5>Recipe Production</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{originalValues.production} g</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.production} g</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='editRecipeComparationBoxDifferent'>
                    <div className='columnaOcupa1Lugar'>
                        <h5>Recipe Production</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{originalValues.production} g</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.production} g</p>
                        </div>
                    </div>
                </div>
            )
        }

        {
    originalValues.recipeDetail.map((item, index) => {
        if (item.ingredientQuantity === editingValues.recipeDetail[index].ingredientQuantity) {
            return (
                <div className='editRecipeComparationBoxEqual' key={index}>
                    <div className='columnaOcupa1Lugar'>
                        <h5>{item.Ingredient.name}</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{item.ingredientQuantity} {item.Ingredient.measurementUnit}</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.recipeDetail[index].ingredientQuantity} {item.Ingredient.measurementUnit}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='editRecipeComparationBoxDifferent' key={index}>
                    <div className='columnaOcupa1Lugar'>
                        <h5>{item.Ingredient.name}</h5>
                    </div>
                    <div className='columnaOcupa2Lugares'>
                        <div className='editRecipeComparationBoxBody'>
                            <p>{item.ingredientQuantity} {item.Ingredient.measurementUnit}</p>
                            <FaLongArrowAltRight />
                            <p>{editingValues.recipeDetail[index].ingredientQuantity} {item.Ingredient.measurementUnit}</p>
                        </div>
                    </div>
                </div>
            );
        }
    })
}
    </div>
</Modal.Body>
                <Modal.Footer>
                {disabled ? (
                    <div className='footerContainer'>
                        <div className='textContainer'>
                            <p>No detail has been changed</p>
                        </div>
                        <div className='buttonContainer'>
                            <Button variant="secondary" onClick={() => setShowModalConfirmEditRecipe(false)}>
                                Cancel
                            </Button>
                            <Button disabled variant="primary" onClick={handleConfirmButton}>
                                Confirm
                            </Button>
                        </div>
                    </div>    
                    ) : (
                        <div className='buttonContainer'>
                            <Button variant="secondary" onClick={() => setShowModalConfirmEditRecipe(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleConfirmButton}>
                                Confirm
                            </Button>
                        </div>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}
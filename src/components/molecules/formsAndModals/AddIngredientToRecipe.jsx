import React, { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap'; 
import { recipesContext } from '../../organisms/Recipes'
import AddIngredientDenseTable from '../AddIngredientDenseTable';
import { PopUpModal } from './ConfirmModalAddIngredientsToRecipe';

const AddIngredientToRecipe = ({ ingredients, recipeId }) => {
    
    const { handleAddIngredientsShowPopUpModal, showModalAddIngredientToRecipe, setShowModalAddIngredientToRecipe, setShowModalAddIngredient, successMessage, errorMessage } = useContext(recipesContext);
    const [selectedIngredients, setSelectedIngredients] = useState([]); // Estado para las filas originales
    
    const handleCloseModalAddIngredientToRecipe = () => {
        setShowModalAddIngredientToRecipe(false);
    };

    const AddIngredientsToRecipe = () => {
        console.log("LLAMO ACA")
        handleAddIngredientsShowPopUpModal(selectedIngredients, recipeId)
        console.log("SALIO ACA")
    }
    console.log("estos son los ingredientes", ingredients)

    return (
        <>
        <Modal show={showModalAddIngredientToRecipe} onHide={handleCloseModalAddIngredientToRecipe} size="lg">
            <Modal.Header>
                <div className='headerContainer'>
                    <div className='headerOrganization'>
                    <Modal.Title className='customTextHeaderModal'>Add ingredients to the recipe</Modal.Title>
                    </div>
                    <div className='buttonHeaderLeft'>
                    <Button onClick={setShowModalAddIngredient} variant='dark' type='button' size='sm'>New ingredient</Button>
                    </div>
                </div>
            </Modal.Header>
            {errorMessage || successMessage ? (
                <div className='text'>
                    <div className='errorMessage'>{errorMessage}</div>
                    <div className='successMessage'>{successMessage}</div>
                    </div>
            ) : (
                null
            )}
        {ingredients && ingredients.length > 0 ? (
            <div>
            <Modal.Body>
                <Form>
                <AddIngredientDenseTable ingredients={ingredients} selectedIngredients={selectedIngredients} setSelectedIngredients={setSelectedIngredients}></AddIngredientDenseTable>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleCloseModalAddIngredientToRecipe} variant="secondary">
                    Close
                </Button>
                {selectedIngredients <= 0 ? (
                    <Button disabled variant="primary">Add ingredients to recipe</Button>
                    ) : (
                    <Button onClick={AddIngredientsToRecipe} variant="primary">Add ingredients to recipe</Button>
                    )
                }
            </Modal.Footer>
            </div>
        ) : (
            <div className='box textBox'>There are no ingredients to show. Please add one</div>
        )}
        </Modal>
    </>
    );
};

export default AddIngredientToRecipe;
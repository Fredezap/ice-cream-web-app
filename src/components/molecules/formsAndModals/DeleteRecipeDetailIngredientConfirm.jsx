import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { recipesContext } from '../../organisms/Recipes';
import { appContext } from '../../../App';

export const DeleteRecipeDetailIngredientConfirm = ({ 
    setShowDeleteRecipeDetailIngredientConfirm,
    showDeleteRecipeDetailIngredientConfirm,
    recipeDetailId }) => {
    
    const { handleDeleteRecipeDetailIngredient } = useContext(recipesContext)

    const handleConfirmButton = () => {
        setShowDeleteRecipeDetailIngredientConfirm(false)
        handleDeleteRecipeDetailIngredient(recipeDetailId)
    }

    return (
        <>
            <Modal show={showDeleteRecipeDetailIngredientConfirm} onHide={() => setShowDeleteRecipeDetailIngredientConfirm(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'red'}}>DELETE AN INGREDIENT FROM RECIPE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure that you want to delete this ingredient from this recipe?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteRecipeDetailIngredientConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmButton}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
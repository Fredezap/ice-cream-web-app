import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { recipesContext } from '../../organisms/Recipes';

export const ConfirmModalAddIngredientsToRecipe = ({ filteredIngredients }) => {
    
    const { setShowPopUpModal, showPopUpModal, handleAddIngredientsToRecipe } = useContext(recipesContext)
    console.log(filteredIngredients)

    const handleConfirmButton = () => {
        setShowPopUpModal(false)
        handleAddIngredientsToRecipe()
    }

    return (
        <>
            <Modal show={showPopUpModal} onHide={() => setShowPopUpModal(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure that you want to add this ingredients to the recipe?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {filteredIngredients.map((ingredient, index) => (
                        <div key={index}>
                            <div className='rowBoxPopUpModal'>
                            <p>{ingredient.quantity} {ingredient.measurementUnit}</p>
                            <p>{ingredient.ingredientName}</p>
                            </div>
                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPopUpModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmButton}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
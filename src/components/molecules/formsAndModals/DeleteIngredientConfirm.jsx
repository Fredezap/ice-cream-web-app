import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { recipesContext } from '../../organisms/Recipes';

export const DeleteIngredientConfirm = ({ 
    setShowDeleteIngredientConfirm,
    showDeleteIngredientConfirm,
    handleDeleteAnIngredient,
    ingredientSelectedForDelete }) => {
    
    const handleConfirmButton = () => {
        setShowDeleteIngredientConfirm(false)
        handleDeleteAnIngredient(ingredientId)
    }

    let ingredientId = null;
    let ingredientName = '';

    if (ingredientSelectedForDelete) {
        ingredientId = ingredientSelectedForDelete.ingredientId;
        ingredientName = ingredientSelectedForDelete.name;    
    }
    
    return (
        <>
            <Modal show={showDeleteIngredientConfirm} onHide={() => setShowDeleteIngredientConfirm(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'red'}}>DELETE AN INGREDIENT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure that you want to delete <sapn style={{fontWeight: '600'}}>{ingredientName}</sapn>?</p>
                    <h3 style={{color: 'yellow', fontWeight: '600', marginTop: '25px'}}>Attention</h3>
                    <p style={{fontWeight: '600'}}>If you delete an ingredient, it will modify all the recipes where the ingredient was included.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteIngredientConfirm(false)}>
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
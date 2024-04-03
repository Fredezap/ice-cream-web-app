import React, { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { recipesContext } from '../../organisms/Recipes';

export const DeleteRecipeConfirm = ({ 
    setShowDeleteRecipeConfirm,
    showDeleteRecipeConfirm,
    recipeSelectedToDelete }) => {
    
    const { handleDeleteRecipe }= useContext(recipesContext)

    const handleConfirmButton = () => {
        setShowDeleteRecipeConfirm(false)
        handleDeleteRecipe(recipeId)
    }

    let recipeId = null;
    let recipeName = '';
    console.log("EN EL MODAL", showDeleteRecipeConfirm)

    if (recipeSelectedToDelete) {
        console.log("RECETA EN MODAL", recipeSelectedToDelete)
        recipeId = recipeSelectedToDelete.recipeId;
        recipeName = recipeSelectedToDelete.name;    
    }
    
    return (
        <>
            <Modal show={showDeleteRecipeConfirm} onHide={() => setShowDeleteRecipeConfirm(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'red'}}>DELETE A RECIPE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure that you want to delete recipe <sapn style={{fontWeight: '600'}}>{recipeName}</sapn>?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteRecipeConfirm(false)}>
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
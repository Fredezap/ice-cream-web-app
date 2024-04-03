import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { recipesContext } from '../../organisms/Recipes';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

export const GlutenFreeIngredientsModal = ({
    recipeDetails,
    showModalGlutenFreeIngredients,
    setShowModalGlutenFreeIngredients}) => {

    return (
        <>
            <Modal size='sm' show={showModalGlutenFreeIngredients} onHide={() => setShowModalGlutenFreeIngredients(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Gluten free detail
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
    <div className='recipeEditBoxComparation'>
    {recipeDetails.map((item, index) => {
        if (item.Ingredient.glutenFree === true) {
            return (
                <div className='gapBox' key={index}>
                        <h5>{item.Ingredient.name}</h5>
                        <BsCheckCircleFill className="checkedIcon" />
                </div>
            );
        } else {
            return (
                <div className='gapBox' key={index}>
                    <h5>{item.Ingredient.name}</h5>
                    <BsXCircleFill className="uncheckedIcon" />
                </div>
            );
        }
    })}
    
    </div>
</Modal.Body>
                <Modal.Footer>
                    <div className='footerContainer'>
                        <div className='buttonContainer'>
                            <Button variant="secondary" onClick={() => setShowModalGlutenFreeIngredients(false)}>
                                Close
                            </Button>
                        </div>
                    </div>    
                </Modal.Footer>
            </Modal>
        </>
    );
}
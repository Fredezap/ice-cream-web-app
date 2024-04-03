import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';

export const VegetarianIngredientsModal = ({
    recipeDetails,
    showModalVegetarianIngredients,
    setShowModalVegetarianIngredients}) => {

    return (
        <>
            <Modal size='sm' show={showModalVegetarianIngredients} onHide={() => setShowModalVegetarianIngredients(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Vegetarian detail
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
    <div className='recipeEditBoxComparation'>
    {recipeDetails.map((item, index) => {
        if (item.Ingredient.vegetarian === true) {
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
                            <Button variant="secondary" onClick={() => setShowModalVegetarianIngredients(false)}>
                                Close
                            </Button>
                        </div>
                    </div>    
                </Modal.Footer>
            </Modal>
        </>
    );
}
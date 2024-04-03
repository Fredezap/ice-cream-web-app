import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const ShowIngredientDescription = ({ 
        ingredientDescription, 
        showIngredientDescription,
        setShowIngredientDescription
    }) => {

    return (
        <>
            <Modal show={showIngredientDescription} onHide={() => setShowIngredientDescription(false)} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Description</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {ingredientDescription ? (
                        <div className='rowBoxPopUpModal'>
                            <p>{ingredientDescription}</p>
                        </div>
                    ) : (
                        <div className='rowBoxPopUpModal'>
                            <p>No ingredient description to show</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowIngredientDescription(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
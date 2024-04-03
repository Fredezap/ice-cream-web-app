import React, { useContext, useState } from 'react';
import { Button, Form, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'; 
import { recipesContext } from '../../organisms/Recipes'

const NewRecipeModal = () => {

    const { showModalAddRecipe, setShowModalAddRecipe, handleSubmitAddRecipe } = useContext(recipesContext);
    const [formDataAddRecipe, setFormDataAddRecipe] = useState({ name: '', description: '', productionQuantity: '' });
    const [nameDisabled, setNameDisabled] = useState(true);
    const [productionDisabled, setproductionDisabled] = useState(true);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {nameDisabled ? (
                <p>Name must be at least 2 characters long</p>
            ) : (
                null
            )}
            {productionDisabled ? (
                <p>Quantity is required</p>
            ) : (
                null
            )}
        </Tooltip>
    );

    const productionQuantityMessage = (props) => (
        <Tooltip id="button-tooltip" {...props}>
                <p>Production quantity must be in grams!</p>
        </Tooltip>
    );

    const handleCloseModalAddRecipe = () => {
        setFormDataAddRecipe({
            name: '',
            description: '',
            productionQuantity: '',
        })
        setShowModalAddRecipe(false);
    };

    const handleInputChangeForCreateRecipe = (e) => {
        const { name, value } = e.target;
    
        setFormDataAddRecipe((prevData) => {
            const newData = {
                ...prevData,
                [name]: value,
            };
            console.log("ACA")
            setNameDisabled(newData.name.length <= 1);
            setproductionDisabled(newData.productionQuantity.length === 0);
            
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formDataAddRecipe)
        handleCloseModalAddRecipe();
        await handleSubmitAddRecipe(formDataAddRecipe);
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    return (
        <>
        <Modal show={showModalAddRecipe} onHide={handleCloseModalAddRecipe}>
            <Modal.Header>
                <Modal.Title>Add a new recipe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="newRecipeForm.name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ej: Coconut"
                        autoFocus
                        name="name"
                        value={formDataAddRecipe.name}
                        onChange={handleInputChangeForCreateRecipe}
                        onKeyDown={handleKeyDown}
                    />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newRecipeForm.description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        name="description"
                        value={formDataAddRecipe.description}
                        onChange={handleInputChangeForCreateRecipe}
                    />
                    </Form.Group>
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={productionQuantityMessage}
                        >
                        <Form.Group className="mb-3" controlId="newRecipeForm.productionQuantity">
                        <Form.Label>Produccion</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Ej: 2000"
                            name="productionQuantity"
                            value={formDataAddRecipe.productionQuantity}
                            onChange={handleInputChangeForCreateRecipe}
                        />
                        </Form.Group>
                        </OverlayTrigger>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalAddRecipe}>
                    Cancel
                </Button>
                {nameDisabled || productionDisabled ? (
                    <OverlayTrigger
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        overlay={renderTooltip}
                        >
                        <Button variant="primary">Create</Button>
                        </OverlayTrigger>
                    ) : (
                    <Button onClick={handleSubmit} variant="primary">Create</Button>
                    )
                }
            </Modal.Footer>
        </Modal>
    </>
    );
}

export default NewRecipeModal;

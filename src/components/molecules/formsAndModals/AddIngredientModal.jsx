import React, { useContext } from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'; 
import { recipesContext } from '../../organisms/Recipes'
import { ErrorMessage, Formik, Field  } from 'formik';
import { Form as FormikForm } from 'formik';
import * as Yup from 'yup';
import LargePrimaryButton from '../../atoms/buttons/LargePrimaryButton';
import LargeSecondaryButton from '../../atoms/buttons/LargeSecondaryButton';

const AddIngredientModal = () => {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    
    // Agregar un evento para prevenir el desplazamiento al girar la rueda del ratón a cada campo de entrada de tipo número
    numberInputs.forEach(input => {
        input.addEventListener('wheel', function(event) {
            event.preventDefault();
        });
    });
    
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
                <p>Package size must be in grams, ml, etc (NO kg, l, etc)</p>
        </Tooltip>
    );
    
    const { showModalAddIngredient, handleSubmitAddIngredient, setShowModalAddIngredient } = useContext(recipesContext);

    const registerSchema = Yup.object().shape({
        name: Yup.string().required('Ingredient name is required').min(2),
        description: Yup.string(),
        packageSize: Yup.number('Write just numbers').positive('Package size must be a positive number').required('Package size is required'),
        measurementUnit: Yup.string().required('Measurement unit is required').matches(/^[A-Za-z]+$/, 'Measurement unit must contain only letters'),
        cost: Yup.number('Write just numbers').min(0, 'Cost must be a positive number').required('Cost is required'),
        kcal: Yup.number('Write just numbers').min(0, 'Kcal must be a positive number'),
        fat: Yup.number('Write just numbers').min(0, 'Fat must be a positive number'),
        carbohydrates: Yup.number('Write just numbers').min(0, 'Carbohydrates must be a positive number'),
        fiber: Yup.number('Write just numbers').min(0, 'Fiber must be a positive number'),
        proteins: Yup.number('Write just numbers').min(0, 'Proteins must be a positive number'),
        sodium: Yup.number('Write just numbers').min(0, 'Sodium must be a positive number'),
        glutenFree: Yup.boolean(),
        vegetarian: Yup.boolean()
    });

    const InitialValues = {
        name: '',
        description: '',
        packageSize: '',
        measurementUnit: '',
        cost: '',
        kcal: '',
        fat: '',
        carbohydrates: '',
        fiber: '',
        proteins: '',
        sodium: '',
        glutenFree: false,
        vegetarian: false,
    }

    const handleCloseModalAddIngredient = () => {
        console.log("cerrando modal")
        setShowModalAddIngredient(false);
    };

    const handleSubmitForm = async (newIngredient) => {
        console.log("EN EL HANDLE SUBMIT DEL MODAL DE ADD INGREDIENT")
        await handleSubmitAddIngredient(newIngredient);
    }

    return (
    <Modal size='lg' show={showModalAddIngredient} onHide={handleCloseModalAddIngredient}>
        <Modal.Header>
        <Modal.Title>Add a new ingredient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik
            initialValues={InitialValues}
            validationSchema={registerSchema}
            onSubmit={async (values) => {
                console.log("ON SUBMIT")
            try {
                console.log("SUBMITING");
                Object.keys(values).forEach(key => {
                if (values[key] === '') {
                    values[key] = null;
                }
                });
                await handleSubmitForm(values);
            } catch (error) {
                console.error("Error submitting form:", error);
            }
        }}
        >
            {({ values, errors, touched, isSubmitting }) => (
            <FormikForm>
            {isSubmitting ? (
                    <div className='loginMessage'>
                        Creating a new ingredient, please wait
                    </div>
                ) : (
                <div>
                <div className="formGroup">
                    <label htmlFor="name">Name</label>
                    <Field
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Name"
                        type="text"
                    />
                </div>
                    <ErrorMessage name="name" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="description">Description</label>
                <Field
                    as="textarea"
                    className="form-control"
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Description"
                />
            </div>
                <ErrorMessage name="description" component="div" className="errorMessage" />

            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
                >
                <div className="formGroup">
                <label htmlFor="packageSize">Package size</label>
                <Field
                    className="form-control"
                    id="packageSize"
                    name="packageSize"
                    placeholder="Ej: 5000"
                    type="number"
                />
                </div>
            </OverlayTrigger>
                <ErrorMessage name="packageSize" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="measurementUnit">Measurement unit</label>
                <Field
                    className="form-control"
                    id="measurementUnit"
                    name="measurementUnit"
                    placeholder="Ej: ml, g, etc"
                />
            </div>
                <ErrorMessage name="measurementUnit" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="cost">Cost</label>
                <Field
                    className="form-control"
                    id="cost"
                    name="cost"
                    placeholder="Cost"
                    type="number"
                />
            </div>
                <ErrorMessage name="cost" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="kcal">Kcal</label>
                <Field
                    className="form-control"
                    id="kcal"
                    name="kcal"
                    placeholder="Kcal"
                    type="number"
                />
            </div>
                <ErrorMessage name="kcal" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="fat">Fat</label>
                <Field
                    className="form-control"
                    id="fat"
                    name="fat"
                    placeholder="Fat"
                    type="number"
                />
            </div>
                <ErrorMessage name="fat" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="carbohydrates">Carbohydrates</label>
                <Field
                    className="form-control"
                    id="carbohydrates"
                    name="carbohydrates"
                    placeholder="Carbohydrates"
                    type="number"
                />
            </div>
                <ErrorMessage name="carbohydrates" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="fiber">Fiber</label>
                <Field
                    className="form-control"
                    id="fiber"
                    name="fiber"
                    placeholder="Fiber"
                    type="number"
                />
            </div>
                <ErrorMessage name="fiber" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="proteins">Proteins</label>
                <Field
                    className="form-control"
                    id="proteins"
                    name="proteins"
                    placeholder="Proteins"
                    type="number"
                />
            </div>
                <ErrorMessage name="proteins" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="sodium">Sodium</label>
                <Field
                    className="form-control"
                    id="sodium"
                    name="sodium"
                    placeholder="Sodium"
                    type="number"
                />
            </div>
                <ErrorMessage name="sodium" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="glutenFree">Gluten Free</label>
                <Field
                    className="form-check-input"
                    id="glutenFree"
                    name="glutenFree"
                    type="checkbox"
                />
            </div>
                <ErrorMessage name="glutenFree" component="div" className="errorMessage" />

            <div className="formGroup">
                <label htmlFor="vegetarian">Vegetarian</label>
                <Field
                    className="form-check-input"
                    id="vegetarian"
                    name="vegetarian"
                    type="checkbox"
                />
            </div>
                <ErrorMessage name="vegetarian" component="div" className="errorMessage" />

                <div className='rowBox'>
                        <LargePrimaryButton type='submit'>Create</LargePrimaryButton>
                        <div onClick={handleCloseModalAddIngredient}>
                        <LargeSecondaryButton type='button' onClick={handleCloseModalAddIngredient}>Close</LargeSecondaryButton>
                        </div>
                    </div>
                </div>
                )}
            </FormikForm>
            )}
        </Formik>
        </Modal.Body>
    </Modal>
    );
};

export default AddIngredientModal;


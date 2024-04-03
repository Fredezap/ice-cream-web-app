import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LittleBlackButton from '../../components/atoms/buttons/LittleBlackButton'
import { useContext } from 'react';
import { recipesContext } from '../organisms/Recipes';
import { Input } from '../atoms/formsParts/Input'
import { TableFooter } from '@mui/material';
import WhiteButton from '../atoms/buttons/WhiteButton';
import LitteWhiteButton from '../atoms/buttons/LittleWhiteButton';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { DeleteIngredientConfirm } from './formsAndModals/DeleteIngredientConfirm';
import { DeleteRecipeConfirm } from './formsAndModals/DeleteRecipeConfirm';
import LittleGreenButton from '../atoms/buttons/LittleGreenButton';
import RedButton from '../atoms/buttons/RedButton';
import { MdCheckBox } from 'react-icons/md';
import { BsXCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { useRef } from 'react';
import { createRef } from 'react';
import { ConfirmModalEditRecipe } from './formsAndModals/ConfirmModalEditRecipe';
import { GlutenFreeIngredientsModal } from './formsAndModals/GlutenFreeIngredientsModal';
import NoBackgroundBottonIngredients from '../atoms/buttons/NoBackgroundBottonIngredients';
import NoBackgroundBotton from '../atoms/buttons/NoBackgroundBotton';
import { VegetarianIngredientsModal } from './formsAndModals/VegetarianIngredientsModal';
import { DeleteRecipeDetailIngredientConfirm } from './formsAndModals/DeleteRecipeDetailIngredientConfirm';

const CustomizedTable = ({ recipe }) => {

    const navigate = useNavigate();
    const { handleShowModalAddIngredientToRecipe, setShowRecipeDetailById, 
            showRecipeDetailById, handleDeleteRecipe, handleEditRecipe } = useContext(recipesContext)
    const productionQuantityInputRef = useRef(null);
    const recipeNameInputRef = useRef(null);
    const recipeDetailInputRef = useRef([]);
    const recipeDescriptionInputRef = useRef([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredRecipeDetailRow, setHoveredRecipeDetailRow] = useState(null);
    const [editing, setEditing] = useState(false);
    const [showModalConfirmEditRecipe, setShowModalConfirmEditRecipe] = useState(false);
    const [showModalGlutenFreeIngredients, setShowModalGlutenFreeIngredients] = useState(false);
    const [showModalVegetarianIngredients, setShowModalVegetarianIngredients] = useState(false);

    const [editingValues, setEditingValues] = useState({
        recipeId: recipe.recipeId,
        production: recipe.productionQuantity,
        name: recipe.name,
        description: recipe.description,
        recipeDetail: recipe.RecipeDetails
    });

    const [originalValues, setOriginalValues] = useState({
        recipeId: recipe.recipeId,
        production: recipe.productionQuantity,
        name: recipe.name,
        description: recipe.description,
        recipeDetail: recipe.RecipeDetails
    });

    const handleIngredientQuantityChange = (ingredientId, quantity) => {
        setEditingValues(prevState => ({
            ...prevState,
            recipeDetail: {
                ...prevState.recipeDetail,
                [ingredientId]: {
                    ...prevState.recipeDetail[ingredientId],
                    ingredientQuantity: parseFloat(quantity)
                }
            }
        }));
        setTimeout(() => {
            recipeDetailInputRef.current[ingredientId].current.focus();
        }, 0);
    };

    const handleRecipeDescriptionChange = (description) => {
        setEditingValues(prevState => ({
            ...prevState,
            description: description
        }));
        setTimeout(() => {
            // Establecer el foco en el textarea
            recipeDescriptionInputRef.current.focus();
            
            // Mover el cursor al final del textarea
            recipeDescriptionInputRef.current.selectionStart = recipeDescriptionInputRef.current.selectionEnd = recipeDescriptionInputRef.current.value.length;
        }, 0);
    };
    const handleProductionChange = (quantity) => {
        setEditingValues(prevState => ({
            ...prevState,
            production: parseFloat(quantity)
        }));
        setTimeout(() => {
            productionQuantityInputRef.current.focus();
        }, 0);
    };

    const handleRecipeNameChange = (name) => {
        setEditingValues(prevState => ({
            ...prevState,
            name: name
        }));
        setTimeout(() => {
            recipeNameInputRef.current.focus();
        }, 0);
    };

    const manageShowRecipeDetail = () => {
        setShowRecipeDetailById((prev) => {
            if (prev.includes(recipe.recipeId)) {
                return prev.filter((id) => id !== recipe.recipeId);
            } else {
                return [...prev, recipe.recipeId];
            }
        });
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
        border: 0,
        },
    }));

    const [showDeleteRecipeConfirm, setShowDeleteRecipeConfirm] = useState(false);
    const [recipeSelectedToDelete, setRecipeSelectedToDelete] = useState(null);
    const [showDeleteRecipeDetailIngredientConfirm, setShowDeleteRecipeDetailIngredientConfirm] = useState(false);
    
    const handleDeleteRecipeShowModal = () => {
        setRecipeSelectedToDelete(recipe)
        setShowDeleteRecipeConfirm(true)
    }

    let totalDosage = 0;
    let totalCostDosage = 0;
    let percentages = [];
    const productionQuantity = recipe.productionQuantity

    totalCostDosage = Object.values(recipe.RecipeDetails).reduce((total, item) => {
        const itemCost = item.Ingredient.cost;
        const dosage = item.ingredientQuantity;
        totalDosage += dosage; 
        return total + itemCost;
    }, 0);

    let isVegetarian = false
    let isGluttenFree = false

    isVegetarian = !Object.values(recipe.RecipeDetails).some(item => {
        return item.Ingredient.vegetarian === false
    })

    isGluttenFree = !Object.values(recipe.RecipeDetails).some(item => {
        return item.Ingredient.glutenFree === false
    })

    Object.values(recipe.RecipeDetails).forEach(item => {
        const itemQuantity = item.ingredientQuantity;
        const ingredient = item.Ingredient
        const dosageCost = ((itemQuantity * ingredient.cost) / ingredient.packageSize).toFixed(2);
        const dosagePerProduction = ((itemQuantity * productionQuantity) / totalDosage).toFixed(2);
        const productionCost = ((dosagePerProduction * ingredient.cost) / ingredient.packageSize).toFixed(2);
        const productionPercentage = ((dosagePerProduction * 100) / productionQuantity).toFixed(2);
        const Kcal = ((dosagePerProduction * ingredient.kcal) / ingredient.packageSize).toFixed(2);
        const Fat = ((dosagePerProduction * ingredient.fat) / ingredient.packageSize).toFixed(2);
        const Carbohydrates = ((dosagePerProduction * ingredient.carbohydrates) / ingredient.packageSize).toFixed(2);
        const Fiber = ((dosagePerProduction * ingredient.fiber) / ingredient.packageSize).toFixed(2);
        const Protein = ((dosagePerProduction * ingredient.proteins) / ingredient.packageSize).toFixed(2);
        const Salt = ((dosagePerProduction * ingredient.sodium) / ingredient.packageSize).toFixed(2);
        const allDataItem = {Kcal, productionPercentage, Fat, Carbohydrates, Fiber, 
            Protein, Salt, dosageCost, dosagePerProduction, productionCost}
        percentages.push(allDataItem);
    });
    
    let totalProductionCost = 0;
    let totalKcal = 0;
    let totalFats = 0;
    let totalCarbohydrates = 0;
    let totalFiber = 0;
    let totalProteins = 0;
    let totalSalt = 0;
    let totalProductionPercentageKcal = 0;
    let totalProductionPercentageFats = 0;
    let totalProductionPercentageCarbohydrates = 0;
    let totalProductionPercentageFiber = 0;
    let totalProductionPercentageProteins = 0;
    let totalProductionPercentageSalt = 0;

    totalCostDosage = percentages.reduce((total, element) => {
        totalProductionCost = (parseFloat(totalProductionCost) + parseFloat(element.productionCost)).toFixed(2);
        totalKcal = parseFloat((totalKcal + parseFloat(element.Kcal)).toFixed(2));
        totalFats = parseFloat((totalFats + parseFloat(element.Fat)).toFixed(2));
        totalCarbohydrates = parseFloat((totalCarbohydrates + parseFloat(element.Carbohydrates)).toFixed(2));
        totalFiber = parseFloat((totalFiber + parseFloat(element.Fiber)).toFixed(2));
        totalProteins = parseFloat((totalProteins + parseFloat(element.Protein)).toFixed(2));
        totalSalt = parseFloat((totalSalt + parseFloat(element.Salt)).toFixed(2));
        totalProductionPercentageKcal = ((totalKcal * 100) / productionQuantity).toFixed(2);
        totalProductionPercentageFats = ((totalFats * 100) / productionQuantity).toFixed(2);
        totalProductionPercentageCarbohydrates = ((totalCarbohydrates * 100) / productionQuantity).toFixed(2);
        totalProductionPercentageFiber = ((totalFiber * 100) / productionQuantity).toFixed(2);
        totalProductionPercentageProteins = ((totalProteins * 100) / productionQuantity).toFixed(2);
        totalProductionPercentageSalt = ((totalSalt * 100) / productionQuantity).toFixed(2);
        return (parseFloat(total) + parseFloat(element.dosageCost)).toFixed(2);
    }, (0));

    const costPerKg = ((1000 * totalProductionCost) / productionQuantity).toFixed(2);

    const isHovered = (Id) => {
        setHoveredRow(Id); // Establece el ID de la fila sobre la que está el cursor
    };

    const isHoveredRecipeDetail = (Id) => {
        setHoveredRecipeDetailRow(Id); // Establece el ID de la fila sobre la que está el cursor
    };

    const handleMouseLeave = () => {
        setHoveredRow(null); // Reinicia el estado cuando el mouse sale de la fila
    };

    const handleEditing = () => {
        setEditingValues(originalValues)
        setEditing(true)
    }

    useEffect(() => {
        recipeDetailInputRef.current = Array(recipe.RecipeDetails.length).fill().map((_, i) => recipeDetailInputRef.current[i] || createRef());
    }, [recipe.RecipeDetails.length]);

    return (
        <>
        {showRecipeDetailById.includes(recipe.recipeId) ? (
            <div className='box tableBox'>
            <TableContainer component={Paper}> 
            <div className='headerContainer tableStyle'>
            {editing ? (
                <StyledTableCell className='typography' >
            
                    <Typography className=''>Cost per Kg: ${costPerKg}</Typography>
                    <Typography className=''>Production:
                        <input
                            className='inputEditingRecipe'
                            type='number'
                            value={(editingValues.production ? editingValues.production : '')}
                            onChange={(e) => handleProductionChange(e.target.value)}
                            ref={productionQuantityInputRef}
                        />
                    </Typography>
                    <Typography className=''>Production cost: ${totalProductionCost}</Typography>
                
                </StyledTableCell>
            ) : (
                <StyledTableCell className='typography' >
                    <Typography className=''>Cost per Kg: ${costPerKg}</Typography>
                    <Typography className=''>Production: {recipe.productionQuantity / 1000} kg</Typography>
                    <Typography className=''>Production cost: ${totalProductionCost}</Typography>
                </StyledTableCell> 
            )}
            {editing ? (
                <div className='typography headerOrganization'>
                    <Typography variant='h4'>
                        <input
                            className='inputEditingRecipe'
                            type='text'
                            value={(editingValues.name ? editingValues.name : '')}
                            onChange={(e) => handleRecipeNameChange(e.target.value)}
                            ref={recipeNameInputRef}
                        />
                    </Typography>
                </div>
            ) : (
                <div onClick={manageShowRecipeDetail} className='typography headerOrganization'>
                    <Typography variant='h4'>
                        {recipe.name ? recipe.name : "No recipe name"}
                    </Typography>
                </div>
            )}
            <div className='tableButtonsBox'>
                {editing ? (
                    <>
                        <div onClick={() => setEditing(false)}>
                            <RedButton>CANCEL EDITING</RedButton>
                        </div>
                        <div onClick={() => setShowModalConfirmEditRecipe(true)}>
                            <LittleGreenButton>CONFIRM CHANGES</LittleGreenButton>
                        </div>
                    </>
                ) : (
                    <>
                        <div onClick={() => handleShowModalAddIngredientToRecipe(recipe.recipeId)}>
                            <LittleBlackButton>Add ingredients</LittleBlackButton>
                        </div>
                        <div onClick={() => navigate('/ingredients')}>
                            <LitteWhiteButton>See all ingredients</LitteWhiteButton>
                        </div>
                        <div onClick={() => handleEditing()}>
                            <LittleGreenButton>Edit Recipe</LittleGreenButton>
                        </div>
                    </>
                )}
            </div>
        </div>
            {Object.keys(recipe.RecipeDetails).length === 0 ? (
                <Typography className='typography typographyTableBody'>
                    No recipe details to show. Please add at least one ingredient to the recipe
                </Typography>
            ) : (
            <div>
            <Table sx={{ minWidth: 900 }} aria-label="customized table">
            <TableHead className='headerContainer'>
                <TableRow>
                <StyledTableCell colSpan={3}>
                    Dosage details ({totalDosage}g)
                </StyledTableCell>
                <StyledTableCell colSpan={9} className='headerRowBorder'>
                    Production details ({productionQuantity}g)
                </StyledTableCell>
                </TableRow>
                <TableRow>
                <StyledTableCell>Ingredients</StyledTableCell>
                <StyledTableCell>Dosage</StyledTableCell>
                <StyledTableCell>Dosage cost</StyledTableCell>
                <StyledTableCell className='headerRow'>Dosage</StyledTableCell>
                <StyledTableCell>%</StyledTableCell>
                <StyledTableCell>Cost</StyledTableCell>
                <StyledTableCell>Kcal</StyledTableCell>
                <StyledTableCell>Fats</StyledTableCell>
                <StyledTableCell>Carbohydrates</StyledTableCell>
                <StyledTableCell>Fiber</StyledTableCell>
                <StyledTableCell>Proteins</StyledTableCell>
                <StyledTableCell>Salt</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody className='bodyContainer'>
            {Object.keys(recipe.RecipeDetails).map((key, index) => (
            <StyledTableRow className='ingredientDetailRow' key={recipe.RecipeDetails[key].Ingredient.ingredientId} 
            onMouseEnter={() => isHoveredRecipeDetail(recipe.RecipeDetails[key].recipeDetailId)}
            onMouseLeave={handleMouseLeave}>
            <StyledTableCell style={{ fontWeight: '600' }}>
                {recipe.RecipeDetails[key].Ingredient.name || '-'}
            </StyledTableCell>
            {editing ? (
            <td>
            <input
                className='inputEditingRecipe'
                type='number'
                value={(editingValues.recipeDetail[key]?.ingredientQuantity || '')}
                onChange={(e) => handleIngredientQuantityChange(key, e.target.value)}
                ref={recipeDetailInputRef.current[index]}
            />
            </td>
            ) : (
                <StyledTableCell>
                {recipe.RecipeDetails[key].ingredientQuantity || '-'} {recipe.RecipeDetails[key].Ingredient.measurementUnit || ''}
            </StyledTableCell>
            )}
            {percentages.length > index ? (
                <>
                    <StyledTableCell>$ {percentages[index].dosageCost}</StyledTableCell>
                    <StyledTableCell style={{ fontWeight: '600' }} className='bodyColumBorder'>{percentages[index].dosagePerProduction} {recipe.RecipeDetails[key].Ingredient.measurementUnit || ''}</StyledTableCell>
                    <StyledTableCell>{percentages[index].productionPercentage}</StyledTableCell>
                    <StyledTableCell>$ {percentages[index].productionCost}</StyledTableCell>
                    <StyledTableCell>{percentages[index].Kcal}</StyledTableCell>
                    <StyledTableCell>{percentages[index].Fat}</StyledTableCell>
                    <StyledTableCell>{percentages[index].Carbohydrates}</StyledTableCell>
                    <StyledTableCell>{percentages[index].Fiber}</StyledTableCell>
                    <StyledTableCell>{percentages[index].Protein}</StyledTableCell>
                    <StyledTableCell>{percentages[index].Salt}</StyledTableCell>
                </>
            ) : (
                <>
                    <StyledTableCell>-</StyledTableCell>
                    <StyledTableCell>-</StyledTableCell>
                </>
            )}
            {hoveredRecipeDetailRow === recipe.RecipeDetails[key].recipeDetailId && (
            <div onClick={setShowDeleteRecipeDetailIngredientConfirm} id='deleteButtonIngredientBoxLeft' >
                        <DeleteTwoToneIcon id='deleteButtonLeft'></DeleteTwoToneIcon>
                    </div>
                )}
        </StyledTableRow>
    ))}
            <TableRow>
                <StyledTableCell colSpan={3}><hr></hr></StyledTableCell>
                <StyledTableCell colSpan={9} className='bodyColumBorder'><hr></hr></StyledTableCell>
            </TableRow>
            <TableRow className='footerRow'>
            <StyledTableCell>Totals</StyledTableCell>
                <StyledTableCell>{totalDosage}</StyledTableCell>
                <StyledTableCell>$ {totalCostDosage}</StyledTableCell>
                <StyledTableCell className='bodyColumBorder'></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>$ {totalProductionCost}</StyledTableCell>
                <StyledTableCell>{totalKcal}</StyledTableCell>
                <StyledTableCell>{totalFats}</StyledTableCell>
                <StyledTableCell>{totalCarbohydrates}</StyledTableCell>
                <StyledTableCell>{totalFiber}</StyledTableCell>
                <StyledTableCell>{totalProteins}</StyledTableCell>
                <StyledTableCell>{totalSalt}</StyledTableCell>
            </TableRow>
            <TableRow>
            <StyledTableCell style={{fontWeight: '800'}}>Totals %</StyledTableCell>
                <StyledTableCell colSpan={2}></StyledTableCell>
                <StyledTableCell className='bodyColumBorder'></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>{totalProductionPercentageKcal}</StyledTableCell>
                <StyledTableCell>{totalProductionPercentageFats}</StyledTableCell>
                <StyledTableCell>{totalProductionPercentageCarbohydrates}</StyledTableCell>
                <StyledTableCell>{totalProductionPercentageFiber}</StyledTableCell>
                <StyledTableCell>{totalProductionPercentageProteins}</StyledTableCell>
                <StyledTableCell>{totalProductionPercentageSalt}</StyledTableCell>
            </TableRow>
            <TableRow>
                <StyledTableCell colSpan={3}><hr></hr></StyledTableCell>
                <StyledTableCell colSpan={9} className='bodyColumBorder'><hr></hr></StyledTableCell>
            </TableRow>
            <TableRow>
                <StyledTableCell colSpan={6}>
                    <div className='GlutenAndVegetarianBox'>
                        <NoBackgroundBotton onClick={setShowModalGlutenFreeIngredients}>Gluten free</NoBackgroundBotton>     
                        {isGluttenFree ? (
                            <BsCheckCircleFill className="checkedIcon" />
                            ): (
                            <BsXCircleFill className="uncheckedIcon" />
                        )}
                    </div>
                </StyledTableCell>
                <StyledTableCell colSpan={6}>
                    <div className='GlutenAndVegetarianBox'>
                    <NoBackgroundBotton onClick={setShowModalVegetarianIngredients}>Vegetarian</NoBackgroundBotton>
                        {isVegetarian ? (
                            <BsCheckCircleFill className="checkedIcon" />
                        ): (
                            <BsXCircleFill className="uncheckedIcon" />
                        )}
                    </div>
                </StyledTableCell>
            </TableRow>
            </TableBody>
            <TableFooter className='tableFooter'>
            <StyledTableCell colSpan={12}>
                {editing ? (
                    <Typography  className='typography typographyTableFooter'><p className='footerDescription'>Description:</p>
                        <textarea
                            className='inputEditingRecipeDescription'
                            value={editingValues.description ? editingValues.description : ''}
                            onChange={(e) => handleRecipeDescriptionChange(e.target.value)}
                            ref={recipeDescriptionInputRef}
                        />
                    </Typography>
                ) : (
                    recipe.description ? (
                    <Typography  className='typography typographyTableFooter'><p className='footerDescription'>Description:</p> {recipe.description}</Typography>
                    ) : (
                    <Typography className='typography typographyTableFooter'><p className='footerDescription'>Description:</p> No description to show</Typography>
                    )
                )
                }
            </StyledTableCell>
            </TableFooter>
            </Table>
            </div>)}
            </TableContainer>
            </div>
        ) : (
            <div className='box tableBoxNoDetail'>
            <TableContainer component={Paper}>
            
            <div className='headerContainer tableStyle'  onMouseEnter={() => isHovered(recipe.recipeId)}
            onMouseLeave={handleMouseLeave} >
                <div onClick={manageShowRecipeDetail} className='typographyNoDetail headerOrganization'>
                    <Typography variant='h6'>
                        {recipe.name ? (recipe.name) : ("No recipe name")}
                    </Typography>
                </div>
                {hoveredRow === recipe.recipeId && (
                    <TableCell onClick={handleDeleteRecipeShowModal} id='deleteButtonRecipeDetail' >
                        <DeleteTwoToneIcon></DeleteTwoToneIcon>
                    </TableCell>
                )}
            </div>
            </TableContainer>
            <DeleteRecipeConfirm
                setShowDeleteRecipeConfirm={setShowDeleteRecipeConfirm}
                showDeleteRecipeConfirm={showDeleteRecipeConfirm}
                recipeSelectedToDelete={recipeSelectedToDelete}
            />
            </div>
    )}

    <ConfirmModalEditRecipe 
        editingValues={editingValues}
        originalValues={originalValues}
        showModalConfirmEditRecipe={showModalConfirmEditRecipe}
        setShowModalConfirmEditRecipe={setShowModalConfirmEditRecipe}
        />

    <GlutenFreeIngredientsModal
        recipeDetails={recipe.RecipeDetails}
        showModalGlutenFreeIngredients={showModalGlutenFreeIngredients}
        setShowModalGlutenFreeIngredients={setShowModalGlutenFreeIngredients}
        />

        <VegetarianIngredientsModal
            recipeDetails={recipe.RecipeDetails}
            showModalVegetarianIngredients={showModalVegetarianIngredients}
            setShowModalVegetarianIngredients={setShowModalVegetarianIngredients}
        />

        <DeleteRecipeDetailIngredientConfirm
            setShowDeleteRecipeDetailIngredientConfirm={setShowDeleteRecipeDetailIngredientConfirm}
            showDeleteRecipeDetailIngredientConfirm={showDeleteRecipeDetailIngredientConfirm}
            recipeDetailId={hoveredRecipeDetailRow}
        />

    </>
    )
};

export default CustomizedTable;

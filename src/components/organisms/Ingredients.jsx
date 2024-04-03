import React, { useContext, useEffect, useState } from 'react';
import { appContext } from '../../App';
import { Input, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material';
import { Button, Table } from 'react-bootstrap';
import NoBackgroundBottonIngredients from '../atoms/buttons/NoBackgroundBottonIngredients';
import { ShowIngredientDescription } from '../molecules/formsAndModals/ShowIngredientDescription';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import AddIngredientModal from '../molecules/formsAndModals/AddIngredientModal';
import AddIngredientModalFromIngredient from '../molecules/formsAndModals/AddIngredientModalFromIngredient';
import EditIngredientModal from '../molecules/formsAndModals/EditIngredientModal';
import { DeleteIngredientConfirm } from '../molecules/formsAndModals/DeleteIngredientConfirm';

const Ingredients = () => {

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { userData, fetchData } = useContext(appContext);
    const ingredients = userData ? userData.userIngredients : [];
    const [ingredientSelectedForEdit, setingredientSelectedForEdit] = useState(null);
    const [ingredientSelectedForDelete, setingredientSelectedForDelete] = useState(null);
    const [showIngredientDescription, setShowIngredientDescription] = useState(false);
    const [showDeleteIngredientConfirm, setShowDeleteIngredientConfirm] = useState(false);
    const [description, setDescription] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null); // Estado para almacenar la fila sobre la que está el cursor
    const [showModalAddIngredient, setShowModalAddIngredient] = useState(false);
    const [showModalEditIngredient, setShowModalEditIngredient] = useState(false);

    const [rows, setRows] = useState(ingredients);
    const [searchInput, setSearchInput] = useState('');
    const [filteredRows, setFilteredRows] = useState([]); // Estado para las filas filtradasseState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    
    const [order, setOrder] = useState('asc'); // Estado del ordenamiento
    const [orderBy, setOrderBy] = useState('name'); // Columna actualmente ordenada
    const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    };
    
    // Función para comparar elementos durante el ordenamiento
    const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
    };
    
    const setNewErrorMessage = (errorMessage) => {
        setErrorMessage(errorMessage)
        setTimeout(() => {
            setErrorMessage('')
        }, 10000);
    }

    const setNewSuccessMessage = (successMessage) => {
        setSuccessMessage(successMessage)
        setTimeout(() => {
            setSuccessMessage('')
        }, 10000);
    }

    const handleDeleteAnIngredientModal = (ingredient) => {
        setingredientSelectedForDelete(ingredient)
        setShowDeleteIngredientConfirm(true)
    }

    // TODO:ACA TENGO QUE VER AL EDITAR O ELIMINAR (CREO QUE SOLO AL ELIMINAR) DE VER DE ELIMINAR DE LA TABLA RECIPE DETAILS CREO
    // TODO: PARA QUE NO HAYA INCONGRUENCIA DE DATOS. VER ESO
    const handleDeleteAnIngredient = async (ingredientId) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3001/api/delete-an-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ ingredientId: ingredientId })
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                fetchData();
                setShowModalAddIngredient(false)
                setNewSuccessMessage(data.successMessage)
            } else {
                setNewErrorMessage(data.errorMessage)
            }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
    };

    
    const handleEditIngredient = async (newIngredientData, ingredientId) => {
        const token = localStorage.getItem('token')
        console.log("newIngredientData", newIngredientData)
        console.log("ingredientId", ingredientId)
        try {
            const response = await fetch('http://localhost:3001/api/edit-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ newIngredientData, ingredientId }),
            });
            
            const data = await response.json();
            if (response.ok && data.success) {
                fetchData();
                setShowModalAddIngredient(false)
                setNewSuccessMessage(data.successMessage)
            } else {
                setNewErrorMessage(data.errorMessage)
            }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
    };


    const handleSubmitAddIngredient = async (newIngredient) => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:3001/api/create-new-ingredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newIngredient),
            });
            console.log(response)
            const data = await response.json();
            console.log(data)
            if (response.ok && data.success) {
                fetchData();
                setNewSuccessMessage(data.successMessage)
            } else {
                console.log(data.errorMessage)
                setNewErrorMessage(data.errorMessage)
            }
        } catch (err) {
            setNewErrorMessage('Server error')
        }
    };
    

    // Función para obtener el orden de acuerdo a la columna seleccionada
    const getComparator = (order) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    };
    
    // Función auxiliar para comparar dos elementos de acuerdo a la columna seleccionada
    const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
    };
    
    // Manejar clic en una fila
    const handleClick = (event, ingredientId) => {
    const selectedItem = selectedIngredients.find(item => item.ingredientId === ingredientId);
    const itemName = selectedItem ? selectedItem.name : '';
    const itemMeasurementUnit = selectedItem ? selectedItem.measurementUnit : '';
    const selectedIndex = selectedIngredients.findIndex(item => item.ingredientId === ingredientId);
    const quantityFilled = rows.find(row => row.ingredientId === ingredientId && !!row.quantity && row.quantity !== '');
    
    let newSelected = [...selectedIngredients];
    
    if (selectedIndex === -1 && !quantityFilled) {
        newSelected.push({ ingredientId: ingredientId, quantity: '', ingredientName: itemName, measurementUnit: itemMeasurementUnit});
    } else if (selectedIndex > -1 && quantityFilled) {
        // No hacer nada si el elemento ya está seleccionado y el input de cantidad tiene información
    } else {
        if (selectedIndex === -1) {
            newSelected.push({ ingredientId: ingredientId, ingredientName: itemName, measurementUnit: itemMeasurementUnit});
        } else {
            newSelected.splice(selectedIndex, 1);
        }}
        setSelectedIngredients(newSelected);
    };
    
    const isSelected = (ingredientId) => {
    // Verificar si el ingredientId está presente en selectedIngredients
    return selectedIngredients.some(item => item.ingredientId === ingredientId);
    };
    
    const handleSearchInput = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
    };

    const filterRows = () => {
        const filteredRows = rows.filter(row => {
            return row.name.toLowerCase().includes(searchInput);
        });
        setFilteredRows(filteredRows);
    };

    const handleShowDescription = (description) => {
        setDescription(description)
        setShowIngredientDescription(true)
    }

    useEffect(() => {
        setRows(ingredients);
    }, [ingredients]);

    useEffect(() => {
        filterRows();
    }, [rows, searchInput]);

    if (!ingredients) {
        return (
            <div className='gettingMessage'>Getting ingredients. Please wait</div>
            )
        }

        

        // Resto del código...
    
        const isHovered = (ingredientId) => {
            setHoveredRow(ingredientId); // Establece el ID de la fila sobre la que está el cursor
        };
    
        const handleMouseLeave = () => {
            setHoveredRow(null); // Reinicia el estado cuando el mouse sale de la fila
        };
        
        const handleEditIngredientShowModal = (ingredientSelectedForEdit) => {
            setingredientSelectedForEdit(ingredientSelectedForEdit);
            setShowModalEditIngredient(true)
        }

    return (
        <div className='tableBoxIngredients'>
        <div className='ingredientsMessageBox'>
            <div className='successMessage'>{successMessage}</div>
            <div className='errorMessage'>{errorMessage}</div>
        </div>
        <div>
        <div className='HeaderIngredientsBox'>
        <Input
            className='searchInputIngredientsTable'
            value={searchInput}
            onChange={handleSearchInput}
            placeholder='Search'
        />
        <Button onClick={setShowModalAddIngredient} className='addIngredientButton' variant='dark' type='button' size='lg'>New ingredient</Button>
        </div>
        <Table size="small" aria-label="dense table">
            <TableHead className='tableBoxIngredientsHead'>
                <TableRow>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'name'}
                            direction={orderBy === 'name' ? order : 'asc'}
                            onClick={() => handleRequestSort('name')}
                        >
                            Name
                        </TableSortLabel>
                    </TableCell>
                    <TableCell id='ingredientsTableDescription'>
                        <Typography>
                            Desc
                        </Typography>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'packageSize'}
                            direction={orderBy === 'packageSize' ? order : 'asc'}
                            onClick={() => handleRequestSort('packageSize')}
                        >
                            Package size
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'cost'}
                            direction={orderBy === 'cost' ? order : 'asc'}
                            onClick={() => handleRequestSort('cost')}
                        >
                            Cost
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'kcal'}
                            direction={orderBy === 'kcal' ? order : 'asc'}
                            onClick={() => handleRequestSort('kcal')}
                        >
                            Kcal
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'fat'}
                            direction={orderBy === 'fat' ? order : 'asc'}
                            onClick={() => handleRequestSort('fat')}
                        >
                            Fats
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'carbohydrates'}
                            direction={orderBy === 'carbohydrates' ? order : 'asc'}
                            onClick={() => handleRequestSort('carbohydrates')}
                        >
                            Carbo
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'fiber'}
                            direction={orderBy === 'fiber' ? order : 'asc'}
                            onClick={() => handleRequestSort('fiber')}
                        >
                            Fiber
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'proteins'}
                            direction={orderBy === 'proteins' ? order : 'asc'}
                            onClick={() => handleRequestSort('proteins')}
                        >
                            Proteins
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'sodium'}
                            direction={orderBy === 'sodium' ? order : 'asc'}
                            onClick={() => handleRequestSort('sodium')}
                        >
                            Sodium
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'glutenFree'}
                            direction={orderBy === 'glutenFree' ? order : 'asc'}
                            onClick={() => handleRequestSort('glutenFree')}
                        >
                            Gluten free
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'vegetarian'}
                            direction={orderBy === 'vegetarian' ? order : 'asc'}
                            onClick={() => handleRequestSort('vegetarian')}
                        >
                            Veggie
                        </TableSortLabel>
                    </TableCell>
                </TableRow>
            </TableHead>
            {rows && rows.length > 0 ? (
            <TableBody className='tableBoxIngredientsBody'>
            {stableSort(
    searchInput ? filteredRows : rows,
    getComparator(order)
).map((row) => {
    const isItemSelected = isSelected(row.ingredientId) || (!!row.quantity && row.quantity !== '');
    return (
        <React.Fragment key={row.ingredientId}>
            <TableRow
                onClick={(event) => handleClick(event, row.ingredientId)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                onMouseEnter={() => isHovered(row.ingredientId)} // Establece hover en true cuando el mouse entra
                onMouseLeave={handleMouseLeave} // 
            >
                <TableCell>
                    {row.name ? row.name : '-'}
                </TableCell>
                <TableCell>
                    <NoBackgroundBottonIngredients onClick={() => handleShowDescription(row.description)}>
                        See
                    </NoBackgroundBottonIngredients>    
                </TableCell>
                <TableCell>
                    {row.packageSize ? row.packageSize : '-'} {row.measurementUnit ? row.measurementUnit  : '-'}
                </TableCell>
                <TableCell>
                    {row.cost ? row.cost : '-'}
                </TableCell>
                <TableCell>
                    {row.kcal ? row.kcal : '-'}
                </TableCell>
                <TableCell>
                    {row.fat ? row.fat : '-'}
                </TableCell>
                <TableCell>
                    {row.carbohydrates ? row.carbohydrates : '-'}
                </TableCell>
                <TableCell>
                    {row.fiber ? row.fiber : '-'}
                </TableCell>
                <TableCell>
                    {row.proteins ? row.proteins : '-'}
                </TableCell>
                <TableCell>
                    {row.sodium ? row.sodium : '-'}
                </TableCell>
                <TableCell>
                    {row.glutenFree === true ? 'Yes' : 'No'}
                </TableCell>
                <TableCell>
                    {row.vegetarian === true ? 'Yes' : 'No'}
                </TableCell>
                {hoveredRow === row.ingredientId && (
                    <div id='wrappedDivForIngredientTableButtons'>
                        <div onClick={() => handleEditIngredientShowModal(row)} id='divForIngredientTableButtons'>
                            <TableCell id='editButton' >
                                <EditTwoToneIcon></EditTwoToneIcon>
                            </TableCell>
                        </div>
                        <div onClick={() => handleDeleteAnIngredientModal(row)} id='divForIngredientTableButtons'>
                            <TableCell id='deleteButton' >
                                <DeleteTwoToneIcon></DeleteTwoToneIcon>
                            </TableCell>
                        </div>
                    </div>
                    )}
            </TableRow>
            <ShowIngredientDescription
                ingredientDescription={description} 
                showIngredientDescription={showIngredientDescription} 
                setShowIngredientDescription={setShowIngredientDescription} 
            />
        </React.Fragment>
    );
})}
            </TableBody>
            ) : (
                <TableBody>
                    <TableRow>
                    <TableCell colSpan={13} align='center'>No ingredients to show</TableCell>
                    </TableRow>
                </TableBody>
            )}
        </Table>
        
        <AddIngredientModalFromIngredient
            setShowModalAddIngredient={setShowModalAddIngredient}
            showModalAddIngredient={showModalAddIngredient}
            handleSubmitAddIngredient={handleSubmitAddIngredient}
        />
        
        <EditIngredientModal
            showModalEditIngredient={showModalEditIngredient}
            setShowModalEditIngredient={setShowModalEditIngredient}
            handleEditIngredient={handleEditIngredient}
            ingredientSelectedForEdit={ingredientSelectedForEdit}
        />

        <DeleteIngredientConfirm 
            setShowDeleteIngredientConfirm={setShowDeleteIngredientConfirm}
            showDeleteIngredientConfirm={showDeleteIngredientConfirm}
            handleDeleteAnIngredient={handleDeleteAnIngredient}
            ingredientSelectedForDelete={ingredientSelectedForDelete}
        />

        </div>
        </div>
);
};

export default Ingredients;

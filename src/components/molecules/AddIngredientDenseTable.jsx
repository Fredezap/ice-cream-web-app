import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, TableSortLabel, Input } from '@mui/material';

const AddIngredientDenseTable = ({ setSelectedIngredients, selectedIngredients, ingredients }) => {

    const [rows, setRows] = useState(ingredients);
    const [searchInput, setSearchInput] = useState('');
    const [filteredRows, setFilteredRows] = useState([]); // Estado para las filas filtradasseState([]);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            // Crear un nuevo array con los objetos completos de los ingredientes seleccionados
            const newSelected = rows.map(row => ({ ingredientId: row.ingredientId, quantity: row.quantity }));
            setSelectedIngredients(newSelected);
        } else {
            setSelectedIngredients([]); // Limpiar la selección si se desmarca "Seleccionar todo"
        }
    };

    useEffect(() => {
        setRows(ingredients)
    }, [ingredients]);

    const [order, setOrder] = useState('asc'); // Estado del ordenamiento
    const [orderBy, setOrderBy] = useState('name'); // Columna actualmente ordenada
    console.log("INGREDIENTES EN TABLA", ingredients)
    // Función para manejar el cambio de orden en el encabezado
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
            }
        }
        setSelectedIngredients(newSelected);
    };
    
    const isSelected = (ingredientId) => {
        // Verificar si el ingredientId está presente en selectedIngredients
        return selectedIngredients.some(item => item.ingredientId === ingredientId);
    };

    const handleSearchInput = (e) => {
        const inputValue = e.target.value.toLowerCase();
        setSearchInput(inputValue);
            const filteredRows = rows.filter(row => {
                return row.name.toLowerCase().includes(inputValue);
            });
            setFilteredRows(filteredRows);
    };

    const handleQuantityInput = (ingredientId, e) => {
        const value = e.target.value;
        // Actualizar la cantidad en las filas
        const updatedRows = rows.map(row => {
            if (row.ingredientId === ingredientId) {
                return { ...row, quantity: value };
            }
            return row;
        });
        
        // Actualizar el array de ingredientes seleccionados
        const updatedSelectedIngredients = updatedRows.map(row => {
            if (row.quantity !== '' && !!row.quantity) {
                return { ingredientId: row.ingredientId, quantity: row.quantity, ingredientName: row.name, measurementUnit: row.measurementUnit };
            }
            return null;
        }).filter(Boolean);
    
        // Actualizar los estados
        setRows(updatedRows);
        setSelectedIngredients(updatedSelectedIngredients);
    
        // Actualizar filteredRows si es necesario
        const updatedFilteredRows = filteredRows.map(row => {
            const updatedRow = updatedRows.find(updatedRow => updatedRow.ingredientId === row.ingredientId);
            return updatedRow ? { ...row, quantity: updatedRow.quantity } : row;
        });
        setFilteredRows(updatedFilteredRows);
    };

    return (
        <div>
        <Input
            className='searchInput'
            value={searchInput}
            onChange={handleSearchInput}
            placeholder='Search'
        />
        <Table size="small" aria-label="dense table">
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={selectedIngredients.length > 0 && selectedIngredients.length < rows.length}
                            checked={rows.length > 0 && selectedIngredients.length === rows.length}
                            onChange={handleSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    </TableCell>
                    <TableCell>
                        <TableSortLabel
                            active={orderBy === 'name'}
                            direction={orderBy === 'name' ? order : 'asc'}
                            onClick={() => handleRequestSort('name')}
                        >
                            Name
                        </TableSortLabel>
                    </TableCell>
                    <TableCell>
                            Quantity
                    </TableCell>
                    <TableCell>
                            Measurement unit
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {/* Mapear filas ordenadas */}
                {stableSort(
                    searchInput ? filteredRows : rows,
                    getComparator(order)
                    ).map((row) => {
                    const isItemSelected = isSelected(row.ingredientId) || (!!row.quantity && row.quantity !== '');
                    return (
                        <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.ingredientId)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.ingredientId}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox checked={isItemSelected} />
                            </TableCell>
                            <TableCell>
                                {row.name}
                            </TableCell>
                            <TableCell>
                            <Input
                                type='number'
                                value={row.quantity ? row.quantity : ''}
                                onChange={(e) => {
                                    const inputValue = e.target.value.trim(); // Eliminar espacios en blanco
                                    if (inputValue === '' || (!isNaN(inputValue) && parseInt(inputValue) >= 0)) {
                                        handleQuantityInput(row.ingredientId, e);
                                    }
                                }}
                            />
                            </TableCell>
                            <TableCell>
                                {row.measurementUnit}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
        </div>
    );
};

export default AddIngredientDenseTable;
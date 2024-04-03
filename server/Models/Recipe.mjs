import { sequelize } from "../db/SequelizeConfig.mjs";
import { DataTypes } from 'sequelize';
import { RecipeDetail } from './RecipeDetail.mjs';

export const Recipe = sequelize.define('Recipe', {
    
    // TODO: DENTRO DE LOS METODOS, VOY A TENER QUE HACER UNO QUE ACTUALICE LAS RECETAS, SI ES QUE SE MODIFICA UN INGREDIENTE. 
    // TODO: A PARTIR DEL RECIPE DETAIL (ES DECIR,
    // TODO: CUANDO SE AGREGA UN INGREDIENTE O SE MODIFICA UN PRECIO O UN BOOLEANO O SE MODIFICA UN INGREDIENTE) 
    // TODO: ESTE METODO VA A BUSCAR TODAS LAS RECETAS QUE TENGAN ESE INGREDIENTE Y VA A SACAR NUEVAMENTE LAS CUENTAS.
    // TODO: OTRO METODO DEBERIA SER PARECIDO AL ANTERIOR, PERO SI SE ESTA MODIFICANDO SOLO UNA RECETA EN SI, Y NO UN INGREDIENTE.
    // TODO: LA CANT DE ING O SI SE ELIMINA UNO, QUE HAGA LA CUENTA, PERO SOLO EN ESA RECETA.

    recipeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        len: [2, 100],
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    productionQuantity: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
        references: {
            model: 'User',
            key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

Recipe.associateModels = () => {
    Recipe.hasMany(RecipeDetail, { foreignKey: 'recipeId' });
};

// sequelize.sync();
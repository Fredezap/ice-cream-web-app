import { AccountBlocked } from '../Models/AccountBlocked.mjs';
import { Device } from '../Models/Device.mjs';
import { Login } from '../Models/Login.mjs';
import { User } from '../Models/User.mjs'
import { Recipe } from '../Models/Recipe.mjs'
import { DeviceLocation } from '../Models/DeviceLocation.mjs';
import { LoginLocation } from '../Models/LoginLocation.mjs';
import { RecipeDetail } from '../Models/RecipeDetail.mjs';
import { Ingredient } from '../Models/Ingredient.mjs';

export const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne({
        where: {
            email: email,
        },
        include: [
            { model: AccountBlocked },
            { model: Device, include: [{ model: DeviceLocation }] },
            { model: Login, include: [{ model: LoginLocation }] },
            { model: Recipe, include: [{ model: RecipeDetail, include: [{ model: Ingredient}] }] },
        ],
        });
        if (user) {
            return { success: true, user: user };
        } else {
            return { success: false, notFundErrorMessage: `error while getting user` };
        }
    } catch (error) {
    return { success: false, serverErrorMessage: `error while getting user2` } };
    }

export const getUserDataById = async (userId) => {
    try {
        const user = await User.findOne({
            where: {
                userId: userId,
            },
            include: [
                { model: AccountBlocked },
                { model: Device, include: [{ model: DeviceLocation }] },
                { model: Login, include: [{ model: LoginLocation }] },
                { 
                    model: Recipe, 
                    include: [{ 
                        model: RecipeDetail, 
                        include: [{ model: Ingredient}] 
                    }],
                    order: [['name', 'ASC']]
                },
            ],
        });
        if (user) {
            const recipesArray = user.Recipes
            recipesArray.sort(function(a, b) {
                // TODO: Hacer que se agreguen todas con la primer letra en mayuscula, pero en el metodo de agregar receta, asi saco esto.
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                if (nameA < nameB) return -1; // Cambiado de -1 a 1 para orden descendente
                if (nameA > nameB) return 1; // Cambiado de 1 a -1 para orden descendente
                return 0;
            });
            return { success: true, user: user };
        } else {
            return { success: false, notFundErrorMessage: `error while getting user` };
        }
    } catch (error) {

        return { success: false, serverErrorMessage: `error while getting user` } };
};

export const getUserDataByToken = async (token) => {
    try {
        const userFound = await User.findOne({
            include: [
                { 
                    model: Device, 
                    where: { token: token }, 
                },
            ]
        });
        if (userFound) {
            const userId = userFound.userId;
            const getUserDataByIdResult = await getUserDataById(userId);
            if (getUserDataByIdResult) {
                return { success: true, user: getUserDataByIdResult.user };
            } else {
                return { success: false, errorMessage: `error while getting user` };
            }
        } else {
            return { success: false, errorMessage: `error while getting user` };
        }
    } catch (error) {
        return { success: false, errorMessage: `error while getting user` } };
};

export const getDeviceDataByToken = async (token) => {
    try {
        const userFound = await User.findOne({
            include: [
                { model: Device, where: { token: token }},
            ],
        });
        if (userFound) {
            const device = userFound.Devices[0];
            return { success: true, device };
        } else {
            return { success: false, errorMessage: `error while getting device` };
        }
    } catch (error) {
        return { success: false, errorMessage: `error while getting device` } };
};


export const getAllIngredientsByUserId = async (userId) => {
    try {
        const foundedIngredients = await Ingredient.findAll({
            where: {
                userId: userId
            }});
        if (foundedIngredients) {
            return { success: true, foundedIngredients };
        } else {
            return { success: false, errorMessage: `error while getting ingredients` };
        }
    } catch (error) {
        return { success: false, errorMessage: `error while getting ingredients` } };
};

export const getRecipeDetailsByRecipeIdAndIngredientId = async (ingredients, recipeId) => {
    try {
        const results = await Promise.all(ingredients.map(async (ingredient) => {
            const foundedRecipeDetails = await RecipeDetail.findOne({
                where: {
                    recipeId: recipeId,
                    ingredientId: ingredient.ingredientId
                }
            });

            if (foundedRecipeDetails) {
                return true
            }
            return false
        }));

        const alreadyExistError = results.some(result => result === true);
        if (alreadyExistError) {
            return { success: false, errorMessage: `One or more ingredients already exist in the recipe` };
        }

        return { success: true };
    } catch (error) {
        return { success: false, errorMessage: `error while getting ingredients` } };
};
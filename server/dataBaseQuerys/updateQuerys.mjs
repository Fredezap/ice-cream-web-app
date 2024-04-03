import { AccountBlocked } from "../Models/AccountBlocked.mjs";
import { Device } from "../Models/Device.mjs";
import { Ingredient } from "../Models/Ingredient.mjs";
import { Recipe } from "../Models/Recipe.mjs";
import { RecipeDetail } from "../Models/RecipeDetail.mjs";
import { User } from "../Models/User.mjs";
import { sequelize } from "../db/SequelizeConfig.mjs";

export const updateUserAccountBlockedData = async (newUserAccountBlockedData, userId) => {
    try {
        const updateUserAccountBlocked = await AccountBlocked.update(newUserAccountBlockedData, {
            where: { userId: userId }
        })
        if (updateUserAccountBlocked) {
            return { success: true, successMessage: 'User account blocked data updated successfully' };
        } else {
            return { success: false, errorMessage: 'Error while updating user account blocked data' };
        }
    } catch (error) {
            return { success: false, errorMessage: 'Error while updating user account blocked data' };
        }
};

export const updateUserDeviceAData = async (data, userId, deviceId) => {
    try {
        const updateUserDeviceData = await Device.update(data, {
            where: {
                userId: userId,
                deviceId: deviceId,
            }
        })

        if (updateUserDeviceData) {
            return { success: true, successMessage: 'User device data updated successfully' };
        } else {
            return { success: false, errorMessage: 'Error while updating user device data' };
        }
    } catch (error) {
            return { success: false, errorMessage: 'Error while updating user device data' };
        }
};

export const updateUserData = async (data, userId) => {
    try {
        const updateUserData = await User.update(data, {
            where: { userId: userId }
        })
        if (updateUserData) {
            return { success: true, successMessage: 'User data updated successfully' };
        } else {
            return { success: false, errorMessage: 'Error while updating user data' };
        }
    } catch (error) {
            return { success: false, errorMessage: 'Error while updating user data' };
        }
};

export const editAnIngredient = async (newIngredientData, ingredientId) => {
    try {
        const updateIngredient = await Ingredient.update(newIngredientData, {
        where: {
            ingredientId: ingredientId
        }
        });

        if (updateIngredient) {
            return { success: true, successMessage: `Ingredient edited successfully` };
        } else {
            return { success: false, errorMessage: `Error while editing ingredient` };
        }
    } catch (error) {
        return { success: false, errorMessage: `Error while editing ingredient` };
    }
};


export const updateARecipeAndRecipeDetail = async (editingValues) => {
    console.log("entro en db update");
    console.log(typeof editingValues)

    const recipeData = {
        name: editingValues.name,
        productionQuantity: editingValues.production,
        description: editingValues.description
    };

    const recipeId = editingValues.recipeId;

    try {
        // Iniciar transacción
        await sequelize.transaction(async (t) => {
            // Actualizar la receta
            await Recipe.update(recipeData, {
                where: { recipeId: recipeId },
                transaction: t
            });

            // Actualizar los detalles de la receta
            await Promise.all(Object.keys(editingValues.recipeDetail).map(async (index) => {
                console.log("item", editingValues.recipeDetail[index])
                const ingredientQuantity = editingValues.recipeDetail[index].ingredientQuantity
                const recipeDetailId = editingValues.recipeDetail[index].recipeDetailId
                console.log("ingredientQuantity", ingredientQuantity)
                console.log("recipeDetailId", recipeDetailId)
                await RecipeDetail.update(
                    { ingredientQuantity: ingredientQuantity },
                    { where: { recipeDetailId: recipeDetailId }, transaction: t }
                );
            }));
        });

        // Devolver mensaje de éxito
        console.log(" habra succes? ")
        return { success: true, successMessage: `Data has been updated successfully` };
    } catch (error) {
        console.error("Error while updating recipe details", error);
        // Devolver mensaje de error específico
        return { success: false, errorMessage: `Error while updating recipe details: ${error.message}` };
    }
};
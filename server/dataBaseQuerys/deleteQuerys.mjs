import { Ingredient } from '../Models/Ingredient.mjs';
import { Recipe } from '../Models/Recipe.mjs';
import { RecipeDetail } from '../Models/RecipeDetail.mjs';
import { User } from '../Models/User.mjs';

export const deleteUserById = (userId) => {
  User.destroy({
    where: {
      userId: userId,
    }
  })
    .then((rowsDeleted) => {
      if (rowsDeleted === 0) {
        return { success: true, errorMessage: `User deleted successfully` };
      } else {
        return { success: false, errorMessage: `Error while deleting user` };
      }
    })
    .catch((error) => {
      return { success: false, errorMessage: `Error while deleting user. ${error}` };
    });
}


export const deleteAnIngredient = async (ingredientId) => {
  try {
    const rowsDeleted = await Ingredient.destroy({
      where: {
        ingredientId: ingredientId
      }
    });

    if (rowsDeleted === 0) {
      return { success: false, errorMessage: `Error: Ingredient not found or you don't have permission to delete it` };
    } else {
      return { success: true, successMessage: `Ingredient deleted successfully` };
    }
  } catch (error) {
    return { success: false, errorMessage: `Error while deleting ingredient` };
  }
};

export const deleteARecipe = async (recipeId) => {
  try {
    const rowsDeleted = await Recipe.destroy({
      where: {
        recipeId: recipeId
      }
    });

    if (rowsDeleted === 0) {
      return { success: false, errorMessage: `Error: Recipe not found or you don't have permission to delete it` };
    } else {
      return { success: true, successMessage: `Recipe deleted successfully` };
    }
  } catch (error) {
    return { success: false, errorMessage: `Error while deleting recipe` };
  }
};


export const deleteRecipeDetailsRelated = async (recipeDetailId) => {
  try {
    const rowsDeleted = await RecipeDetail.destroy({
      where: {
        recipeDetailId: recipeDetailId
      }
    });

    if (rowsDeleted === 0) {
      return { success: false, errorMessage: `Error: Recipe detail not found or you don't have permission to delete it` };
    } else {
      return { success: true, successMessage: `Recipe detail deleted successfully` };
    }
  } catch (error) {
    return { success: false, errorMessage: `Error while deleting Recipe detail` };
  }
};
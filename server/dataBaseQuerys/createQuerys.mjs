import { AccountBlocked } from '../Models/AccountBlocked.mjs';
import { Device } from '../Models/Device.mjs';
import { DeviceLocation } from '../Models/DeviceLocation.mjs';
import { Ingredient } from '../Models/Ingredient.mjs';
import { Login } from '../Models/Login.mjs';
import { LoginLocation } from '../Models/LoginLocation.mjs';
import { Recipe } from '../Models/Recipe.mjs';
import { RecipeDetail } from '../Models/RecipeDetail.mjs';
import { User } from '../Models/User.mjs'
import { hashPassword } from '../OAuth/bcrypt.mjs'

export const createUser = async (user, loginInfo) => {
    try {
        // Hashing password
        const plainPassword = user.password;
        const hashedPassword = await hashPassword(plainPassword);
        if (!hashedPassword.success) {
            return { success: false, errorMessage: 'Error while creating user' };
        }

        // Add user to db
        const createdUser = await User.create({
            username: user.username,
            email: user.email,
            password: hashedPassword.hashedPassword,
        });

        if (createdUser) {
            const createAccountBlockedResult = createAccountBlocked(createdUser.userId);
            const createDeviceAndDeviceLocationResult = await createDeviceAndDeviceLocation(createdUser.userId, loginInfo)
            if (createAccountBlockedResult && createDeviceAndDeviceLocationResult){
                return { success: true, successMessage: 'User created successfully', user: createdUser };
            } else {
                return { success: false, errorMessage: 'Error while creating user' };
            }
        } else {
            return { success: false, errorMessage: 'Error while creating user' };
        }

    } catch (error) {
        const Error = error.errors[0] ? error.errors[0] : error
        const emailError = Error.type === 'unique violation' && Error.path === 'email';
        const usernameError = Error.type === 'Validation error' && Error.path === 'username';
        if (emailError) {
            return { success: false, errorMessage: 'Email is already registrated' };
        } else if (usernameError) {
            return { success: false, errorMessage: 'Username too short' };
        } else {
            return { success: false, errorMessage: Error.message };
        }
    }
};

export const createAccountBlocked = async (userId) => {
    try {
        const createAccountBlocked = await AccountBlocked.create({
            userId: userId,
        });
        if (createAccountBlocked) {
        return { success: true, successMessage: 'AccountBlocked created' };
    } else {
        return { success: false, errorMessage: `error while creating account blocked` };
    }
    } catch (error) {
    return { success: false, errorMessage: `error en catch createAccountBlocked ${error}` };
    }
};

export const createLogin = async (userId) => {
    try {
        const createLogin = await Login.create({
            userId: userId,
        });
        if (createLogin) {
        return { success: true, successMessage: 'AccountBlocked created' };
    } else {
        return { success: false, errorMessage: `error while creating login` };
    }
    } catch (error) {
    return { success: false, errorMessage: `error while creating login` };
    }
};

export const createDeviceAndDeviceLocation = async (userId, loginInfo) => {
    try {
        const deviceData = {
            browser: loginInfo.browser,
            browserVersion: loginInfo.browserVersion,
            deviceType: loginInfo.deviceType,
            operatingSystem: loginInfo.operatingSystem,
            date: loginInfo.date,
        };

        const deviceLocation = loginInfo.location
        const createNewDevice = await Device.create({
            userId: userId,
            ...deviceData,
        });

        if (createNewDevice) {
            const createNewDeviceLocation = await DeviceLocation.create({
            deviceId: createNewDevice.deviceId,
            ...deviceLocation
        });

        if (createNewDeviceLocation) {
            return { success: true, successMessage: 'new device has been created' };
        } else {
            return { success: false, errorMessage: `error while creating new device` };
        }

    } else {
        return { success: false, errorMessage: `error while creating new device` };
    }
    } catch (error) {
        return { success: false, errorMessage: `error while creating new device` };
    }
};

export const createLoginAndLoginLocationInfo = async (userId, result, loginInfo) => {
    try {
        const loginInfoWithoutLocation = {
            browser: loginInfo.browser,
            browserVersion: loginInfo.browserVersion,
            deviceType: loginInfo.deviceType,
            operatingSystem: loginInfo.operatingSystem,
            date: loginInfo.date,
            result,
        };
    
        const loginInfoLocation = loginInfo.location
        const createNewLogin = await Login.create({
            userId: userId,
            ...loginInfoWithoutLocation,
        });

        if (createNewLogin) {
            const createNewLoginLocation = await LoginLocation.create({
            loginId: createNewLogin.loginId,
            ...loginInfoLocation
        });
        
        if (createNewLoginLocation) {
            return { success: true, successMessage: 'new login has been created' };
        }
        
    } else {
        return { success: false, errorMessage: `error while creating new login` };
    }
    } catch (error) {
        return { success: false, errorMessage: `error while creating new login` };
    }
};


export const createNewRecipe = async (userId, recipe) => {
    try {
        const createNewRecipeResult = await Recipe.create({
            userId: userId,
            ...recipe,
        });

        if (createNewRecipeResult) {
            return { success: true, successMessage: 'New recipe created' };
        } else {
            console.log("error al crear receta")
        return { success: false, errorMessage: `error while creating new recipe` };
    }
    } catch (error) {
        console.log("error al crear receta", error)
        return { success: false, errorMessage: `error while creating new recipe` };
    }
};

export const createNewIngredient = async (userId, ingredient) => {
    console.log("INGREDIENTEEE", ingredient)
    const data = { ...ingredient, userId }
    console.log(data)
    try {
        const createNewIngredientResult = await Ingredient.create(data);
        console.log("createNewIngredientResult", createNewIngredientResult)
        if (createNewIngredientResult) {
            return { success: true, successMessage: 'New ingredient created' };
        } else {
            console.log("error al crear receta")
        return { success: false, errorMessage: `error while creating new ingredient` };
    }
    } catch (error) {
        console.log("error al crear receta", error);
        if (error.name === 'SequelizeUniqueConstraintError' && error.errors.some(err => err.message === 'name must be unique')) {
            return { success: false, errorMessage: `Ingredient name already exists` };
        }
        return { success: false, errorMessage: `Error while creating new ingredient` };
    }
};


export const createNewRecipeDetail = async (ingredients, recipeId) => {
    try {
            const ingredientsAddedResult = await Promise.all(ingredients.map(async (ingredient) => {
                const ingredientId = ingredient.ingredientId
                const ingredientQuantity = ingredient.quantity
                const data = { ingredientId, ingredientQuantity, recipeId }
                const createQuery = await RecipeDetail.create(data);

                    if (createQuery) {
                        return true
                    }
                    return false
                }));

                console.log(ingredientsAddedResult)
                const checkSuccess = ingredientsAddedResult.every(result => result === true);
                console.log("check success", checkSuccess)
                if (!checkSuccess) {
                    const checkHowManyFailed = ingredientsAddedResult.filter(result => result === false).length;
                    console.log("aca, hubo alguno con error")
                    return { success: false, errorMessage: `there was an error adding the ${checkHowManyFailed} ingredients.` };
                }

            console.log("ingredientsAddedResult", ingredientsAddedResult)
            return { success: true, successMessage: `Ingredients has been added to the recipe.`};
    } catch (error) {
        console.log("error al crear receta", error)
        return { success: false, errorMessage: `error while adding ingredients` };
    }
};
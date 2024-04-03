import {  createDeviceAndDeviceLocation, createLoginAndLoginLocationInfo, createNewIngredient, createNewRecipe, createNewRecipeDetail, createUser } from './createQuerys.mjs';
import { sendEmaiNewDeviceConfirmation, sendEmailResetPassword, sendEmailVerification } from '../emailSender/emailManager.mjs';
import { getAllIngredientsByUserId, getRecipeDetailsByRecipeIdAndIngredientId, getUserByEmail, getUserDataById, getUserDataByToken } from './readQuerys.mjs';
import { updateUserAccountBlockedData, updateUserData, updateUserDeviceAData, editAnIngredient } from './updateQuerys.mjs';
import { checkPassword, hashPassword } from '../OAuth/bcrypt.mjs';
import { generateToken, generateValidationToken, verifyTokenJWT } from '../OAuth/jwt.mjs';
import { deleteARecipe, deleteAnIngredient, deleteRecipeDetailsRelated } from './deleteQuerys.mjs';

export const checkTokenAndDevice = async (token, secretKey, loginInfo) => {
  try {
    const verify = await verifyTokenJWT(token, secretKey);
    const userTokenInfo = verify.decoded;
    if (verify.success) {
      const foundUser = await getUserDataByToken(token)
      if (foundUser.success) {
        const user = foundUser.user;
        const { Devices, userId, username, email } = user; 
        const checkDevice = await findDeviceIndex(Devices, loginInfo)
        if (checkDevice !== -1) {
          return { success: true, userTokenInfo };
        } else {
          const generateValidationTokenResult = await generateValidationToken(username, email, userId, secretKey);
          if (generateValidationTokenResult.success) {
            const verificationToken = generateValidationTokenResult.token
            const data = {
              verificationToken
            }
            // TODO: PARECE QUE NODEMAILER NO DEVUELVE UN ERROR SI LA DIRECCION EMAIL NO FUE ENCONTRADA.
            // TODO: SI EL EMAIL NO EXISTE, AVISAR AL USUARIO Y ELIMINAR DE LA BASE DE DATOS ESE USUARIO QUE NUNCA SE VA A PODER VERIFICAR.
            const updateUserDataResult = await updateUserData(data, userId)
            if (updateUserDataResult.success) {
              const verifyEmail = await sendEmaiNewDeviceConfirmation (email, userId, token, loginInfo, username)
              if (verifyEmail.success) {
                return { success: false, forbiddenError: 'This device is not recognized! Please check your email to verify this device.', email: email };
              }
            } else {
              return { success: false, errorMessage: 'Error while checking user credentials' };
            }
          } else {
            return { success: false, errorMessage: 'Error while checking user credentials' };
          }
        }
      } else {
        return { success: false, errorMessage: 'User not fund. Invalid token' };
      }
    } else {
      return { success: false, errorMessage: verify.errorMessage, tokenNull: true };
    }   
  } catch (error) {
    return { success: false, errorMessage: "Server error" };
  }
}

export const addUser = async (user, loginInfo, secretKey) => {
  try {
    const createUserResult = await createUser(user, loginInfo);
    if (createUserResult.success) {
      const user = createUserResult.user
      const { userId, email, username } = user
        const generateValidationTokenResult = await generateValidationToken(username, email, userId, secretKey);
        if (generateValidationTokenResult.success) {
          const verificationToken = generateValidationTokenResult.token
          const data = {
            verificationToken
          }
          // TODO: PARECE QUE NODEMAILER NO DEVUELVE UN ERROR SI LA DIRECCION EMAIL NO FUE ENCONTRADA.
          // TODO: SI EL EMAIL NO EXISTE, AVISAR AL USUARIO Y ELIMINAR DE LA BASE DE DATOS ESE USUARIO QUE NUNCA SE VA A PODER VERIFICAR.
          const updateUserDataResult = await updateUserData(data, userId)
          if (updateUserDataResult.success) {
            const verifyEmail = await sendEmailVerification(email, userId, verificationToken, username)
            if (verifyEmail.success) {
            return { success: true, successMessage: createUserResult.successMessage };
          } else {
            // TODO: VER SI SE PUEDE DEJAR UNA FUNCINO QUE INTENTE REENVIAR EL MAIL, PORQUE A VECES NO LO MANDA POR ERROR DE 
            // TODO: CONEXION. TIRA ERROR connect ETIMEOUT. UNA VEZ COMPRUEBE FUE ENVIADO, LO ELIMINE DEL ARRAY O ALGO ASI.
            return { success: true, successMessage: createUserResult.successMessage, verifyEmailerrorMessage: 'Error while sending email verification. Please contact support' };
          }
        } else {
          return { success: false, errorMessage: createUserResult.errorMessage };
        }
      } else {
        return { success: false, errorMessage: createUserResult.errorMessage };
      }
    } 
  } catch (error) {
    return { success: false, errorMessage: `Error while creating user. ${error}` };
  }
};


export const loginUser = async (userCredentials, secretKey, loginInfo) => {
  try {
    // Check if email is registarted
    const { email: emailFromForm, password: passwordFromForm } = userCredentials
    const getUserData = await getUserByEmail(emailFromForm);
    if (!getUserData.success && getUserData.notFundErrorMessage) {
        return { notFoundError: '¡Unregistered email! Create an account and try to login again' };
    } else if (!getUserData.success && getUserData.serverErrorMessage) {
      return { serverError: getUserData.serverErrorMessage };
    } else {
      const user = getUserData.user
      const { username, email, password, userId, AccountBlocked, Devices } = user
      let { blocked, lockedAt, loginAttempts } = AccountBlocked

    // Check if user account is blocked
    if (user && AccountBlocked && loginAttempts >= 3 && blocked === true) {
      // Check if time account blocked have finished (30 min after it blocked)
      const currentTime = new Date();
      const lockTime = new Date(lockedAt.getTime() + 30 * 60 * 1000);
      if (currentTime < lockTime) {
        return { accountBlockedError: '¡Account blocked! Too many login attempts failed. Try later!' };
      } else {
        loginAttempts = 0
        const newUserAccountBlockedData = {
          loginAttempts,
          blocked: false,
          lockedAt: null
        }
        await updateUserAccountBlockedData(newUserAccountBlockedData, userId );
      }
    }

    const isPasswordCorrect = await checkPassword(passwordFromForm, password)
    try {
      if (isPasswordCorrect.success && isPasswordCorrect.isMatch) {
          const insertDeviceInfoResult = await insertDeviceInfo(userId, email, loginInfo, Devices, username, secretKey);
          if (insertDeviceInfoResult.success) {
            const createLoginAndLoginLocationInfoResult = await createLoginAndLoginLocationInfo(userId, true, loginInfo);
            if (createLoginAndLoginLocationInfoResult) {
              const newUserAccountBlockedData = {
                loginAttempts: 0,
                blocked: false,
                lockedAt: null
              }
              const updateUserAccountBlockedDataResult = await updateUserAccountBlockedData(newUserAccountBlockedData, userId)
              if (updateUserAccountBlockedDataResult) {
                return { success: true, successMessage: 'Inicio de sesión exitoso', token: insertDeviceInfoResult.token };
              }
            }
          } else if (insertDeviceInfoResult.accountNotConfirmed) {
              return { success: false, forbiddenError: 'This device is not recognized! Please check your email to verify this device.', email: email }
            } else {
            return { success: false, errorMessage: 'Error while loggin in' } 
          } 
        } else {
          await createLoginAndLoginLocationInfo(userId, false, loginInfo)
          const failureAttempts = await failureLoginAttempts(userId, loginAttempts);
          return { unauthorizedError: `Incorrect password. ${failureAttempts.message}` };
        }
    } catch (error) {
      return { serverError: 'Error while login in' };
      }}
  } catch (error) {
    return { serverError: 'Error while login in' };
}};

export const findDeviceIndex = (Devices, loginInfo) => {
  const index = Devices.findIndex((device) => {
    const deviceLocation = device.DeviceLocation;

    const checkLocation =
      deviceLocation.country === loginInfo.location.country &&
      deviceLocation.region === loginInfo.location.region &&
      deviceLocation.city === loginInfo.location.city;

    const checkDevice =
      device.browser === loginInfo.browser &&
      device.deviceType === loginInfo.deviceType &&
      device.operatingSystem === loginInfo.operatingSystem;

    return checkDevice && checkLocation;
  });
  return index
};

export const insertDeviceInfo = async (userId, email, loginInfo, Devices, username, secretKey) => {
  try {
        // Verifica si deviceInfo ya está presente en el array
        if (Devices && Devices.length > 0) {
          const index = await findDeviceIndex(Devices, loginInfo)

          const isDeviceAlreadyAdded = index !== -1;
          if (!isDeviceAlreadyAdded) {
            const createNewDeviceResult = await createDeviceAndDeviceLocation(userId, loginInfo)
            if (createNewDeviceResult.success) {
              const checkEmailSent = await sendEmaiNewDeviceConfirmation(email, loginInfo, username);
                // TODO: PARECE QUE NODEMAILER NO DEVUELVE UN ERROR SI LA DIRECCION EMAIL NO FUE ENCONTRADA.
                // TODO: SI EL EMAIL NO EXISTE, AVISAR AL USUARIO Y ELIMINAR DE LA BASE DE DATOS ESE USUARIO QUE NUNCA SE VA A PODER VERIFICAR.
                if (checkEmailSent.success) {
                  return { success: false, accountNotConfirmed: true };
                }
              return { success: false }
            }
          }

        const registratedDevice = Devices[index]
        const deviceId = registratedDevice.deviceId
        const deviceToken = registratedDevice.token

        if (deviceToken === null){
          const generateValidationTokenResult = await generateValidationToken(username, email, userId, secretKey);
          if (generateValidationTokenResult.success) {
            const verificationToken = generateValidationTokenResult.token
            const data = {
              verificationToken
            }
            
            const updateUserDataResult = await updateUserData(data, userId)
            if (updateUserDataResult.success) {
            const checkEmailSent = await sendEmaiNewDeviceConfirmation(email, userId, verificationToken, loginInfo, username);
                // TODO: PARECE QUE NODEMAILER NO DEVUELVE UN ERROR SI LA DIRECCION EMAIL NO FUE ENCONTRADA.
                // TODO: SI EL EMAIL NO EXISTE, AVISAR AL USUARIO Y ELIMINAR DE LA BASE DE DATOS ESE USUARIO QUE NUNCA SE VA A PODER VERIFICAR.
                if (checkEmailSent.success) {
                  return { success: false, accountNotConfirmed: true };
                }
                return { success: false }
            }
          }
        }

        const generateTokenResult = await generateToken(username, email, userId, secretKey);
        if (generateTokenResult.success) {
          const token = generateTokenResult.token
          const date = new Date()
          const data = { token, sessionOpened: true, date }
          const updateResult = updateUserDeviceAData(data, userId, deviceId)
          if (updateResult) {
            return { success: true, token };
          }
        } else {
          return { success: false };
        }
      } else {
        return { success: false };
      }
  } catch (error) {
    return { success: false };
  }
};


export const failureLoginAttempts = async (userId, loginAttempts) => {
  try {
    const date = new Date();
    const newLoginAttempts = loginAttempts ? loginAttempts + 1 : 1;
    if (newLoginAttempts >= 3) {
      const newUserAccountBlockedData = {
        loginAttempts: newLoginAttempts,
        blocked: true,
        lockedAt: date
      }
      await updateUserAccountBlockedData(newUserAccountBlockedData, userId)
      return  { success: true, message: "Your account has been blocked for 30 minutes due to security reasons"};
    } else {
      const newUserAccountBlockedData = {
        loginAttempts: newLoginAttempts,
      }
      await updateUserAccountBlockedData(newUserAccountBlockedData, userId)
      switch (newLoginAttempts) {
        case 1:
          return { success: true, message: "2 more attempts to try"}
        case 2:
          return { success: true, message: "1 more attempt to try"}
        default:
          return { success: false }
      }
    }
  } catch (error) {
    return { success: false }
  }
}


export const getLoginInfo = async (token) => {
  try {
    const foundUser = await getUserDataByToken(token);
    if (!foundUser.success) {
      return { success: false, notFoundError: "User not found" }
    }

    const user = foundUser.user;
    const logins = user.Logins;
    return { success: true, data: logins }
  } catch (error) {
    return { success: false, errorMessage: 'Server error' };
  }
};


export const getDeviceInfo = async (token) => {
  try {
    const userData = await getUserDataByToken(token);
    if (userData.success) {
      const user = userData.user
      const devicesInfo = user.Devices
      return { success: true, data: devicesInfo }
    } else {
      return { success: false, errorMessage: userData.errorMessage };
    }
  } catch (error) {
    return { success: false, serverError: 'internal server error' };
  }
};

export const comfirmAndVerifyAccount = async (userId, urlToken, loginInfo) => {
  try {
      const getUserDataByIdResult = await getUserDataById(userId);
        if (getUserDataByIdResult.success) {
          const userFound = getUserDataByIdResult.user
          const { Devices, verificationToken } = userFound
          const index = await findDeviceIndex(Devices, loginInfo)
          const deviceFound = index !== -1

          if (!deviceFound) {
            return { success: false, errorMessage: 'User device not found' };
          }

          const deviceId = Devices[index].deviceId
          const currentDeviceToken = Devices[index].token
          if (currentDeviceToken !== null) {
            return { success: false, errorMessage: '¡Your account is already confirmed!' };
          }

          const ckeckTokens = verificationToken === urlToken
          if (ckeckTokens) {
            const data = { token: urlToken }
            const updateDeviceToken = await updateUserDeviceAData(data, userId, deviceId)
            // TODO: VER SI QUIZAS ELIMINO EL VERIFY TOKEN QUE TIENE EL USER, YA QUE FUE EXITOSO Y YA NO LO DEBERIA NECESITAR
            if (updateDeviceToken.success) {
              return { success: true, successMessage: '¡Your account has been confirmed successfully!' };
            } else {
              return { success: false, errorMessage: '¡Error while confirmeing your account!' };
            }
          } else {
            return { success: false, errorMessage: '¡Invalid token!' };
          }
        } else {
        return { success: false, errorMessage: '¡Error while confirmeing your account!' };
      }
    } catch (error) {
      return { success: false, errorMessage: '¡Error while confirmeing your account!' };
  }
};

export const resetPassword = async (credentials) => {
  // TODO: CHECKEAR QUE NO SEA EL MISMO PASSWORD QUE EL ANTERIOR
  try {
    const userFound = await getUserByEmail(credentials.email);
    if (!userFound.success) {
        return { success: false, errorMessage: `Error while getting user`};
    }
  
    const hashedPassword = await hashPassword(credentials.password);

    if (hashedPassword.error) {
      return { success: false, errorMessage: 'Error while reseting password' };
    }

    const userId = userFound.user.userId
    const data = {password: hashedPassword.hashedPassword}
    const updateUserDeviceADataResult = await updateUserData(data, userId);
    const newData = {loginAttempts: 0, blocked: false, lockedAt: null}
    const updateUserAccountBlockedDataResult = await updateUserAccountBlockedData(newData, userId)
    if (updateUserDeviceADataResult.success && updateUserAccountBlockedDataResult.success) {
      return { success: true, successMessage: '¡Your password has been updated successfully!' };
    } else {
      return { success: false, errorMessage: 'Error while updating password' };
    }
  } catch (error) {
    return { success: false, errorMessage: 'Error while updating password' };
  }
}

export const unlinkADeviceByIndex = async (token, index) => {
  try {
    const userFound = await getUserDataByToken(token);
    if (userFound) {
      const indexInt = parseInt(index)
      const userId = userFound.user.userId
      const deviceToUpdate = userFound.user.Devices[indexInt] 

    if (deviceToUpdate) {
      const deviceId = deviceToUpdate.deviceId
      const data = { sessionOpened: false }
      const updateUserDeviceADataResult = await updateUserDeviceAData(data, userId, deviceId) 
      if (updateUserDeviceADataResult.success) {
          return { success: true, successMessage: 'Logout successfull' };
        } else {
          return { success: false, errorMessage: 'Logout failed' };
        } 
    } else {
      return { success: false, errorMessage: 'Logout failed' };
    }
    } else {
    return { success: false, errorMessage: 'User not found. Logout failed' };
    }
  } catch (error) {
    return { success: false, errorMessage: 'Server error. Logout failed' };
  }
};

export const unlinkADeviceByToken = async (token) => {
  try {
    const userFound = await getUserDataByToken(token);
    if (!userFound.success) {
      return { success: false, errorMessage: 'User not found' };
    } 

      const devices = userFound.user.Devices
      const index = devices.findIndex((device, i) => {
        return device.token === token
      })
        
      const deviceFound = index !== -1
      if (deviceFound) {
        const deviceToUpdate = devices[index]
        if (deviceToUpdate) {
          const userId = deviceToUpdate.userId
          const deviceId = deviceToUpdate.deviceId
          const data = { sessionOpened: false }
          const updateUserDeviceADataResult = await updateUserDeviceAData(data, userId, deviceId) 
          if (updateUserDeviceADataResult.success) {
              return { success: true, successMessage: 'Logout successfull' };
            } else {
              return { success: false, errorMessage: 'Logout failed' };
            } 
          } else {
            return { success: false, errorMessage: 'Logout failed' };
          } 
        } else {
      return { success: false, errorMessage: 'User not found. Logout failed' };
      }
    } catch (error) {
      return { success: false, errorMessage: 'Server error. Logout failed' };
    }
  };

export const resetPasswordSendEmail = async (email, secretKey) => {
  try {
    const userData = await getUserByEmail(email)
    if (userData.success) {
      const user = userData.user
      const { username, userId } = user
      const generateValidationTokenResult = await generateValidationToken(username, email, userId, secretKey);
      if (generateValidationTokenResult.success) {
        const verificationToken = generateValidationTokenResult.token
        const data = {
          verificationToken
        }
        // TODO: PARECE QUE NODEMAILER NO DEVUELVE UN ERROR SI LA DIRECCION EMAIL NO FUE ENCONTRADA.
        // TODO: SI EL EMAIL NO EXISTE, AVISAR AL USUARIO Y ELIMINAR DE LA BASE DE DATOS ESE USUARIO QUE NUNCA SE VA A PODER VERIFICAR.
        const updateUserDataResult = await updateUserData(data, userId)
        if (updateUserDataResult.success) {
          const verifyEmail = await sendEmailResetPassword(email, username, verificationToken)
          if (verifyEmail.success) {
            return { success: true, successMessage: 'Email has been sent successfully. Pleas check your Email'};
          } else {
            return { success: false, errorMessage: 'Error while sending email' };
          }
        } else {
          return { success: false, errorMessage: 'Error while sending email' };
        }
      } else {
        return { success: false, errorMessage: 'Error while sending email' };
      }
    } else {
      return { success: false, notFoundErrorMessage: 'Email not registrated' };
    }
  } catch(error) {
    return { success: false, errorMessage: 'Error while sending email' };
  }
};

export const HandleCreateNewRecipe = async (token, recipe) => {
  try {
    const userData = await getUserDataByToken(token);
    if (userData.success) {
      const userId = userData.user.userId
      const createNewRecipeResult = await createNewRecipe(userId, recipe)
      if (createNewRecipeResult.success) {
        return { success: true, successMessage: createNewRecipeResult.successMessage }
      } else {
        return { success: false, errorMessage: createNewRecipeResult.errorMessage };
      };
    } else {
      return { success: false, errorMessage: userData.notFoundError };
    }
  } catch (error) {
    return { success: false, errorMessage: 'Server error' };
  }
};


export const HandleCreateNewIngredient = async (token, ingredient) => {
  try {
    const userData = await getUserDataByToken(token);
    if (userData.success) {
      const userId = userData.user.userId
      const createNewIngredientResult = await createNewIngredient(userId, ingredient)
      if (createNewIngredientResult.success) {
        return { success: true, successMessage: createNewIngredientResult.successMessage }
      } else {
        return { success: false, errorMessage: createNewIngredientResult.errorMessage };
      };
    } else {
      return { success: false, errorMessage: userData.notFoundError };
    }
  } catch (error) {
    return { success: false, errorMessage: 'Server error' };
  }
};


export const HandleEditAnIngredient = async (newIngredientData, ingredientId) => {
    try {
      const editAnIngredientResult = await editAnIngredient(newIngredientData, ingredientId)
      if (editAnIngredientResult.success) {
          return { success: true, successMessage: editAnIngredientResult.successMessage }
        } else {
          return { success: false, errorMessage: editAnIngredientResult.errorMessage };
        };
    } catch (error) {
      return { success: false, errorMessage: 'Server error' };
    }
};


export const HandleDeleteAnIngredient = async (ingredientId) => {
  try {
    const deleteAnIngredientResult = await deleteAnIngredient(ingredientId)
    if (deleteAnIngredientResult.success) {
        return { success: true, successMessage: deleteAnIngredientResult.successMessage }
      } else {
        return { success: false, errorMessage: deleteAnIngredientResult.errorMessage };
      };
  } catch (error) {
    return { success: false, errorMessage: 'Server error' };
  }
};


export const HandleDeleteRecipe = async (recipeId) => {
  try {
    const deleteAnIngredientResult = await deleteARecipe(recipeId)
    if (deleteAnIngredientResult.success) {
        return { success: true, successMessage: deleteAnIngredientResult.successMessage }
      } else {
        return { success: false, errorMessage: deleteAnIngredientResult.errorMessage };
      };
  } catch (error) {
    return { success: false, errorMessage: 'Server error' };
  }
};


export const HandleDeleteRecipeDetailIngredient = async (recipeDetailId) => {
  try {
    const deleteAnIngredientResult = await deleteRecipeDetailsRelated(recipeDetailId)
    if (deleteAnIngredientResult.success) {
        return { success: true, successMessage: deleteAnIngredientResult.successMessage }
      } else {
        return { success: false, errorMessage: deleteAnIngredientResult.errorMessage };
      };
  } catch (error) {
    return { success: false, errorMessage: 'Server error' };
  }
};


export const HandleUpdateRecipe = async (ingredients, recipeId) => {
  try {
    const checkIfExist = await getRecipeDetailsByRecipeIdAndIngredientId(ingredients, recipeId);
    if (!checkIfExist.success) {
      return { success: false, errorMessage: checkIfExist.errorMessage}
    }

    const createNewRecipeDetailResult = await createNewRecipeDetail(ingredients, recipeId);
    if (!createNewRecipeDetailResult.success) {
      return { success: false, errorMessage: checkIfExist.errorMessage}
    }

    return { success: true, successMessage: createNewRecipeDetailResult.successMessage}
  } catch (error) {
    return { success: false, errorMessage: "Error while updating recipe ingredients" };
  }
}


export const getAllRecipes = async (token) => {
  try {
    const userFound = await getUserDataByToken(token);
    if (userFound.success) {
      const recipes = userFound.user.Recipes
      // TODO: AHORA NO SOLO TRAE LAS RECETAS, TRAER INGREDIENTES Y TODO. HAY QUE SEPARAR Y ENVIAR TODO AL FRONT
      // TODO: ME DEJA AGREGAR EN RECIPE DETAILS INGREDIENTES QUE NO SEAN DEL MISMO USER ID. VER ESO
      const recipesArray = Object.values(recipes);

      const sortedRecipes = recipesArray.sort(function(a, b) {
        // TODO: Hacer que se agreguen todas con la primer letra en mayuscula, pero en el metodo de agregar receta, asi saco esto.
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();

          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
      });
      return { success: true, recipes: sortedRecipes };

      } else if (userFound.notFoundError) {
      return { success: false, errorMessage: userFound.notFoundError };
      } else {
        return { success: false, errorMessage: userFound.serverError };
      }
  } catch (error) {
    return { success: false, errorMessage: "Error while getting recipes" };
  }
}

export const getAllUserIngredients = async (token) => {
  try {
    const userFound = await getUserDataByToken(token);
    if (userFound.success) {
      const userId = userFound.user.userId
      const Allingredients = await getAllIngredientsByUserId(userId);
      if (Allingredients.success) {
        const ingredients = Allingredients.foundedIngredients
        return { success: true, ingredients };
      } else {
        return { success: false, errorMessage: "Error while getting ingredients" };
      }
    } else {
      return { success: false, errorMessage: "Error while getting ingredients" };
    }
  } catch (error) {
    return { success: false, errorMessage: "Error while getting ingredients" };
  }
};
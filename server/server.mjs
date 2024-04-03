import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { HandleCreateNewIngredient, HandleCreateNewRecipe, HandleDeleteAnIngredient, HandleDeleteRecipe,
        HandleDeleteRecipeDetailIngredient,
        HandleEditAnIngredient, HandleUpdateRecipe, addUser, checkTokenAndDevice,
        comfirmAndVerifyAccount, getAllRecipes, getAllUserIngredients, getDeviceInfo, getLoginInfo, loginUser,
        resetPassword, resetPasswordSendEmail, unlinkADeviceByIndex, unlinkADeviceByToken }
        from './dataBaseQuerys/dbQuerys.mjs'
// import crypto from 'crypto';
import useragent from 'express-useragent';
import axios from 'axios';
import device from 'express-device';
import { verifyTokenJWT } from './OAuth/jwt.mjs';
import { getDeviceDataByToken, getUserDataByToken } from './dataBaseQuerys/readQuerys.mjs';
import { updateARecipeAndRecipeDetail } from './dataBaseQuerys/updateQuerys.mjs';

const secretKey = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const app = express();
const port = 3001;
app.use(cors());
app.use(bodyParser.json());
app.use(useragent.express());
app.use(device.capture());

// TODO: VERIFICAR CUALES METODOS SON GET Y CUALES POST
// TODO: HACER UN MIDDLEWARE QUE CHEQUEE LOS TOKENS AL INICIAR SESION Y CIERRE LAS SESSIONES EN LAS CUALES LOS TOKENS HAYAN CADUCADO
// Middleware to verify token
// TODO: VOVLER A  VER MENSAJES DE ERROR. PARA QUE ME TIRE A LOGIN SI HAY UN INVALID TOKEN
async function verifyToken(req, res, next) {
  try {
    const token = req.headers['authorization'];
    const deviceInfoFromClient = await getDeviceInfoFromForm(req);
      if (deviceInfoFromClient.success) {
        const loginInfo = deviceInfoFromClient.loginInfo
        const checkTokenAndDevicResult = await checkTokenAndDevice(token, secretKey, loginInfo);
        if (checkTokenAndDevicResult.success) {
          req.user = checkTokenAndDevicResult.userTokenInfo
          next();
        } else if (checkTokenAndDevicResult.forbiddenError) {
          const errorMessage = checkTokenAndDevicResult.forbiddenError
          const email = checkTokenAndDevicResult.email
          res.status(401).json({
            success: false,
            status: 401,
            errorMessage,
            redirectTo: `http://localhost:3000/login?email=${email}&forbiddenError=${encodeURIComponent(errorMessage)}`
          });
        } else {
          const errorMessage = checkTokenAndDevicResult.errorMessage
          res.status(401).json({
            success: false,
            status: 401,
            errorMessage,
            redirectTo: `http://localhost:3000/login?errorMessage=${encodeURIComponent(errorMessage)}`
          });
        }
      } else {
        const errorMessage = deviceInfoFromClient.errorMessage
        res.status(401).json({
          success: false,
          status: 401,
          errorMessage,
          redirectTo: `http://localhost:3000/login?errorMessage=${encodeURIComponent(errorMessage)}`
        });
      }
  } catch (error) {
    res.status(404).json({ success: false, errorMessage: 'Server error' });
  }
}

async function getDeviceInfoFromForm(req) {
  try {
    const browser = req.useragent.browser;
    const browserVersion = req.useragent.version;
    const deviceType = req.device.type;
    let operatingSystem = req.device.os;

    if (operatingSystem === undefined) {
      try {
        const userAgentHeader = req.headers['user-agent'];
        const agent = useragent.parse(userAgentHeader);
        operatingSystem = agent.os.toString()
      } catch (error) {
        operatingSystem = undefined
    }};

    const ipInfoApiKey = '81cb7417a315b7';
    const ipAddress = '190.188.149.243';
    // TODO: OBTENER LA IP REAL
    const apiUrl = `http://ipinfo.io/${ipAddress}?token=${ipInfoApiKey}`;

    let location = null
    await axios.get(apiUrl)
    .then(response => {
      location = response.data
    })
    .catch(error => {
      location = null
    });

    const loginInfo = {
      browser,
      browserVersion,
      deviceType,
      operatingSystem: 'Windows',
      date: new Date().toISOString(),
      location: location
    };
    return { success: true, loginInfo };

  } catch (error) {
    return { success: false, errorMessage: "Error while getting device info" };
  }
};

app.post('/api/check-token-and-session-opened', async (req, res) => {
    const token = req.headers['authorization'];
    try {
      const verify = await verifyTokenJWT(token, secretKey);
      if (verify.success) {
          const deviceFound = await getDeviceDataByToken(token);

          if (deviceFound) {
            const checkSessionOpened = deviceFound.device.sessionOpened === true;
          if (checkSessionOpened) {
            res.status(201).json({ success: true });
          }
          else {
            res.status(401).json({ success: false, errorMessage: 'Session Expired' });
          }
        }
      } else {
        res.status(401).json({ success: false, errorMessage: verify.errorMessage });
      }
    } catch (error) {
      res.status(500).json({ success: false, errorMessage: "Server error" });
    }
  });

app.get('/api/account-confirmation', async (req, res) => {
  const { userId, token } = req.query;
  const info = await getDeviceInfoFromForm(req);
  if (!info.success) {
    res.status(404).json({ success: false, errorMessage: 'Error al obtener informacion del ususario' });
  }

  try {
    const updateUser = await comfirmAndVerifyAccount(userId, token, info.loginInfo);
    if (updateUser.success) {
      res.redirect(`http://localhost:3000/login?successMessage=${encodeURIComponent(updateUser.successMessage)}`);
    } else {
      res.redirect(`http://localhost:3000/?errorMessage=${encodeURIComponent(updateUser.errorMessage)}`);
    }
  } catch (error) {
    res.redirect(`http://localhost:3000/?errorMessage=${encodeURIComponent('internal server error')}`);
  }
});


app.post('/api/forgot-password-send-email', async (req, res) => {
  const email = req.body.email;
  try {
    const resetPasswordSendEmailResult = await resetPasswordSendEmail(email, secretKey)
    if (resetPasswordSendEmailResult.success) {
      res.status(201).json({ success: true, successMessage: resetPasswordSendEmailResult.successMessage });
    } else if (resetPasswordSendEmailResult.notFoundErrorMessage) {
      res.status(404).json({ success: false, errorMessage: resetPasswordSendEmailResult.notFoundErrorMessage });
    } else {
      res.status(500).json({ success: false, errorMessage: resetPasswordSendEmailResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Server error' });
  }
});

// TODO:TANTO EN EL DE ARRIBA COMO EL DE ABAJO, TENGO QUE CADUCAR LAS SESIONES DE TODOS LOS DISPOSITIVOS SI ES QUE RESETEA
// TODO: LA CONTRASEÑA. SINO NO TIENE SENTIDO EL CAMBIO DE CONSTRASEAÑA, A NO SER QUE SEA PORQUE SE LA OLVIDO.

app.post('/api/forgot-password-reset', async (req, res) => {
  const credentials = req.body;

  try {
    const tryResetPassword = await resetPassword(credentials);
    if (tryResetPassword.success){
      res.status(201).json({ success: true, successMessage: tryResetPassword.successMessage })
    } else {
      res.status(500).json({ success: false, errorMessage: tryResetPassword.errorMessage })
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/get-login-info', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const loginData = await getLoginInfo(token);
    if (loginData.success) {
      res.status(201).json({ success: true, loginData: loginData.data });
    } else if (loginData.notFoundError) {
      res.status(404).json({ success: false, errorMessage: loginData.notFoundError });
    } else {
      res.status(500).json({ success: false, errorMessage: loginData.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: 'Server error' })
  }
});


app.post('/api/get-device-info/', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const deviceData = await getDeviceInfo(token);
    if (deviceData.success) {
      res.status(201).json({ success: true, deviceData: deviceData.data });
    } else if (deviceData.notFoundError) {
      res.status(404).json({ success: false, errorMessage: deviceData.notFoundError });
    } else {
      res.status(500).json({ success: false, errorMessage: deviceData.serverError });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.get('/api/get-all-recipes/', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const recipes = await getAllRecipes(token);
    if (recipes.success){
      res.status(201).json({ success: true, Recipes: recipes.recipes });
    } else {
      res.status(404).json({ success: false, errorMessage: recipes.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});

app.get('/api/get-all-ingredients/', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const ingredients = await getAllUserIngredients(token);
    if (ingredients.success){
      res.status(201).json({ success: true, Ingredients: ingredients.ingredients });
    } else {
      res.status(404).json({ success: false, errorMessage: ingredients.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});

app.get('/api/get-user-data/', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const userData = await getUserDataByToken(token)
    const ingredients = await getAllUserIngredients(token)
    if (userData && ingredients) {
      const recipes = userData.user.Recipes
      res.status(201).json({ success: true, ingredients, recipes });
    } else {
      res.status(404).json({ success: false, errorMessage: ingredients.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});

app.post('/api/create-new-recipe/', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const recipe = req.body
    const recipeCreatedResult = await HandleCreateNewRecipe(token, recipe);
    if (recipeCreatedResult.success) {
      res.status(201).json({ success: true, successMessage: recipeCreatedResult.successMessage });
    } else if (recipeCreatedResult.notFoundError) {
      res.status(404).json({ success: false, errorMessage: recipeCreatedResult.notFoundError });
    } else {
      res.status(500).json({ success: false, errorMessage: recipeCreatedResult.serverError });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/create-new-ingredient/', verifyToken, async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const ingredient = req.body
    const recipeCreatedResult = await HandleCreateNewIngredient(token, ingredient);

    if (recipeCreatedResult.success) {
      res.status(201).json({ success: true, successMessage: recipeCreatedResult.successMessage });
    } else {
      res.status(500).json({ success: false, errorMessage: recipeCreatedResult.errorMessage });
    }
  } catch (error) {

    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/edit-ingredient', verifyToken, async (req, res) => {
  const { newIngredientData, ingredientId } = req.body
  try {
    const editAnIngredientResult = await HandleEditAnIngredient(newIngredientData, ingredientId);
    if (editAnIngredientResult.success) {
      res.status(201).json({ success: true, successMessage: editAnIngredientResult.successMessage });
    } else {
      res.status(404).json({ success: false, errorMessage: editAnIngredientResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/delete-an-ingredient', verifyToken, async (req, res) => {
  const { ingredientId } = req.body
  try {
    const deleteAnIngredientResult = await HandleDeleteAnIngredient(ingredientId);
    if (deleteAnIngredientResult.success) {
      res.status(201).json({ success: true, successMessage: deleteAnIngredientResult.successMessage });
    } else {
      res.status(404).json({ success: false, errorMessage: deleteAnIngredientResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/delete-a-recipe', verifyToken, async (req, res) => {
  const { recipeId } = req.body
  try {
    const deleteAnIngredientResult = await HandleDeleteRecipe(recipeId);
    if (deleteAnIngredientResult.success) {
      res.status(201).json({ success: true, successMessage: deleteAnIngredientResult.successMessage });
    } else {
      res.status(404).json({ success: false, errorMessage: deleteAnIngredientResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/delete-recipe-detail-ingredient', verifyToken, async (req, res) => {
  const { recipeDetailId } = req.body
  try {
    const deleteAnIngredientResult = await HandleDeleteRecipeDetailIngredient(recipeDetailId);
    if (deleteAnIngredientResult.success) {
      res.status(201).json({ success: true, successMessage: deleteAnIngredientResult.successMessage });
    } else {
      res.status(404).json({ success: false, errorMessage: deleteAnIngredientResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/edit-a-recipe-and-recipe-details', verifyToken, async (req, res) => {
  const { editingValues } = req.body
  try {
    const updateARecipeAndRecipeDetailResult = await updateARecipeAndRecipeDetail(editingValues);
    if (updateARecipeAndRecipeDetailResult.success) {
      res.status(201).json({ success: true, successMessage: updateARecipeAndRecipeDetailResult.successMessage });
    } else {
      res.status(404).json({ success: false, errorMessage: updateARecipeAndRecipeDetailResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/add-ingredients-to-recipe', verifyToken, async (req, res) => {
  try {
    // const token = req.headers['authorization'];
    const { filteredIngredients, recipeId } = req.body
    const recipeCreatedResult = await HandleUpdateRecipe(filteredIngredients, recipeId);

    if (recipeCreatedResult.success) {
      res.status(201).json({ success: true, successMessage: recipeCreatedResult.successMessage });
    } else {
      res.status(500).json({ success: false, errorMessage: recipeCreatedResult.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/unlink-a-device-by-index', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const index = req.body.index
    const query = await unlinkADeviceByIndex(token, index);
    if (query.success) {
      res.status(201).json({ success: true, successMessage: query.successMessage });
    } else {
      res.status(500).json({ success: false, errorMessage: query.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: 'Server error' })
  }
});


app.post('/api/unlink-a-device-by-token', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const query = await unlinkADeviceByToken(token);
    if (query.success) {
      res.status(201).json({ success: true, successMessage: query.successMessage });
    } else {
        res.status(404).json({ success: false, errorMessage: query.errorMessage });
    }
  } catch (error) {
    res.status(500).json({ errorMessage: 'Server error' })
  }
});


app.post('/api/register-user', async (req, res) => {
  try {
    // TODO: TRAER DATOS DE UN USER, ASI NOMAS, DEL FRONT, SIN FORMULARIO.
    const user = req.body;
    const info = await getDeviceInfoFromForm(req);
    if (!info.success) {
      res.status(404).json({ success: false, errorMessage: 'Error al obtener datos del ususario' });
    }

    const loginInfo = info.loginInfo
      const query = await addUser(user, loginInfo, secretKey);
      if (query.success) {
        // If user created but email verification not sent
        if (query.verifyEmailerrorMessage) {
          return res.status(201).json({ success: true, successMessage: query.successMessage, verifyEmailerrorMessage: query.verifyEmailerrorMessage });
        }
        res.status(201).json({ success: true, successMessage: query.successMessage });
      } else {
          res.status(404).json({ success: false, errorMessage: query.errorMessage });
      }
    } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' })
  }
});


app.post('/api/login', async (req, res) => {

    const info = await getDeviceInfoFromForm(req);
    if (!info.success) {
      res.status(404).json({ success: false, errorMessage: 'Error al obtener informacion del ususario' });
    }

    const userCredentials = req.body;
    try {
    const loginAttempt = await loginUser(userCredentials, secretKey, info.loginInfo);
    if (loginAttempt.success) {
      res.status(201).json({ success: true, successMessage: loginAttempt.successMessage, token: loginAttempt.token });
    } else if (loginAttempt.notFoundError) {
      res.status(404).json({ success: false, notFoundError: loginAttempt.notFoundError });
    } else if (loginAttempt.accountBlockedError) {
      res.status(403).json({ success: false, errorMessage: loginAttempt.accountBlockedError });
    } else if (loginAttempt.forbiddenError) {
      res.status(403).json({ success: false, forbiddenError: loginAttempt.forbiddenError, email: loginAttempt.email });
    } else if (loginAttempt.unauthorizedError) {
      res.status(401).json({ success: false, errorMessage: loginAttempt.unauthorizedError });
    } else if (loginAttempt.serverError) {
      res.status(500).json({ success: false, errorMessage: loginAttempt.serverError });
    } else {
      res.status(500).json({ success: false, errorMessage: 'Internal server error' });
    }
  } catch (error) {
    res.status(500).json({ success: false, errorMessage: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
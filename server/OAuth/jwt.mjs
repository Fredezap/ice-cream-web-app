import jwt from 'jsonwebtoken';
import { getDeviceDataByToken } from '../dataBaseQuerys/readQuerys.mjs';
import { updateUserDeviceAData } from '../dataBaseQuerys/updateQuerys.mjs';

export const generateToken = async (username, email, userId, secretKey) => {

    const payload = {
        userId,
        username,
        email,
    };

    const token = await jwt.sign(payload, secretKey, { expiresIn: '168h' });

    if (token) {
      return { success: true, token }
    } else {
      return { success: false, token: null }
    }
}

export const generateValidationToken = async (username, email, userId, secretKey) => {

  const payload = {
      userId,
      username,
      email,
  };

  const token = await jwt.sign(payload, secretKey, { expiresIn: '1h' });

  if (token) {
    return { success: true, token }
  } else {
    return { success: false, token: null }
  }
}


export const verifyTokenJWT = async (token, secretKey) => {
  try {
    if (!token) {
      return { success: false, errorMessage: 'Please log in' };
    }
    const decoded = await jwt.verify(token, secretKey);
    return { success: true, decoded, successMessage: 'Valid token' };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      try {
        const deviceFound = await getDeviceDataByToken(token);
        if (deviceFound) {
        const device = deviceFound.device
        const { deviceId, userId } = device
        const data = { sessionOpened: false }
        await updateUserDeviceAData(data, userId, deviceId)
        }
      } catch(error) {
        return { success: false, errorMessage: 'Token has expired' };
      }
      return { success: false, errorMessage: 'Token has expired' };
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.log(err)
      return { success: false, errorMessage: 'Invalid token' };
    } else {
      return { success: false, errorMessage: 'Unknown error while verifying token' };
    }
  }
};
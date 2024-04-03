import bcrypt from 'bcrypt';

// Password hashing and salting
export const hashPassword = async (plainPassword) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return { success: true, hashedPassword };
  } catch ( error ) {
    return { success: false, error };
  }
};

// Password verifying
export const checkPassword = async (plainPassword, hashedPassword) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
  if (isMatch) {
    return { success: true, isMatch };
  } else {
    return { success: false, isMatch };
  }
};
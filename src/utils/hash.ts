import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  barePassword: string,
  salt: string,
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(barePassword, salt);

  return hashedPassword;
};

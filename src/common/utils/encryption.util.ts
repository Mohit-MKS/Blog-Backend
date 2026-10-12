import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const cryptoSecretKey = '123Mohit2022';

export const hashPassword = (password: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    bcrypt.genSalt(12, (error, salt) => {
      if (error) {
        return reject(error);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          return reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const decrypt = (encryptedValue: string): string => {
  const key = crypto
    .createHash('sha256')
    .update(cryptoSecretKey)
    .digest('base64')
    .slice(0, 32);

  const parts = encryptedValue.split(':');
  const iv = Buffer.from(parts[0], 'base64');
  const encryptedData = parts[1];
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key as unknown as crypto.CipherKey,
    iv as unknown as crypto.BinaryLike,
  );
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

export const encrypt = (value: string): string => {
  const key = crypto
    .createHash('sha256')
    .update(cryptoSecretKey)
    .digest('base64')
    .slice(0, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    key as unknown as crypto.CipherKey,
    iv as unknown as crypto.BinaryLike,
  );
  let encrypted = cipher.update(value, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return iv.toString('base64') + ':' + encrypted;
};

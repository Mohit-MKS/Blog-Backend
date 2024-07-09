import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const cryptoSecretKey = "123Mohit2022";

const hashPassword = (password: string) => {
  return new Promise<string>((resolve, rejects) => {
    bcrypt.genSalt(12, (error, salt) => {
      if (error) {
        return rejects(error);
      }

      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          return rejects(error);
        }
        resolve(hash);
      })
    })
  })
}

const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword)
}


const decrypt = (encryptedValue: string) => {
  const key = crypto.createHash('sha256').update(cryptoSecretKey).digest('base64').slice(0, 32);

  // Split the encrypted value into IV and the actual encrypted data
  const parts = encryptedValue.split(':');
  const iv = Buffer.from(parts[0], 'base64');
  const encryptedData = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const encrypt = (value: string) => {
  const key = crypto.createHash('sha256').update(cryptoSecretKey).digest('base64').slice(0, 32);
  const iv = crypto.randomBytes(16); // Generate a random IV
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(value, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // Return the IV with the encrypted data for decryption later
  return iv.toString('base64') + ':' + encrypted;
};


export { hashPassword, comparePassword, encrypt, decrypt }
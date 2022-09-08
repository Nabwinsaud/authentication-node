// hash password helper

import bcrypt, { hash } from "bcrypt";

// hash password

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) reject(err);
          resolve(hash);
        });
      }
    });
  });
};

//
// export const hashPasswords = async (password) => {
//   try {
//     const saltRound = 12;
//     const salt = await bcrypt.genSalt(saltRound);
//     const hashPassword = bcrypt.hash(password, salt);
//     return hashPassword;
//   } catch (error) {
//     throw new Error(err);
//   }
// };

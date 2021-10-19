import pkg from "bcryptjs";
const { genSalt, hash } = pkg;
import { user } from "./user/user.js";

export async function registerUser(name, email, password, confirmpassword) {
  // generate salt
  const salt = await genSalt(10);
  // hash with salt

  const hashedPassword = await hash(password, salt);
  const confirmHashedPassword = await hash(confirmpassword, salt);
  // store in database
  // store in database

  try {
    if (hashedPassword == confirmHashedPassword) {
      const result = await user.insertOne({
        name: name,
        email: {
          address: email,
          verified: false,
        },
        password: hashedPassword,
      });
      return result.insertedId;
    }
  } catch (error) {
    console.error("error log");
  }
  // return user from db
}

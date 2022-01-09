const dotenv = require("dotenv");

dotenv.config();

const {
  APP_PORT,
  DEBUG_MODE,
  DBURL,
  JWT_SECRET,
  REFRESH_SECRET,
  CLOUDINARY_USER_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

module.exports = {
  APP_PORT,
  DEBUG_MODE,
  DBURL,
  JWT_SECRET,
  REFRESH_SECRET,
  CLOUDINARY_USER_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
};

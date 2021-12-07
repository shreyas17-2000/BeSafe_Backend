const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//schema
const adminDbSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

adminDbSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);

      this.password = hash;
      next();
    });
  }
});

adminDbSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing,can not compare!");
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (e) {
    console.log("Error while comparing ", e.message);
  }
};

adminDbSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid email");
  try {
    const user = await this.findOne({ email });
    if (user) return false;

    return true;
  } catch (e) {
    console.log("error inside is this emailuse method", e.message);
    return false;
  }
};

module.exports = mongoose.model("AdminDb", adminDbSchema);

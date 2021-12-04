const User = require("../models/user");

class AuthController {
  async createUser(req, res) {
    const { name, email, password } = req.body;
    const isNewuser = await User.isThisEmailInUse(email);
    if (!isNewuser)
      return res.json({
        success: false,
        message: "this email is already in use",
      });
    const user = await User({
      name,
      email,
      password,
    });
    await user.save();
    res.json({ success: true, user });
  }
  async userSignIn(req, res){
    const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "user not found with the given email",
    });

  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return res.json({
      success: false,
      message: "email / password does not match!",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({ success: true, user, token });
  }
}
module.exports = new AuthController();

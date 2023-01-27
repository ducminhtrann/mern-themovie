import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signUp = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;
    const checkUser = await userModel.findOne({ username });
    if (checkUser)
      return responseHandler.badRequest(res, "username already used");

    const user = new userModel();
    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);

    await user.save();
    const token = jwt.sign({ data: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    return responseHandler.error(res);
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel
      .findOne({ username })
      .select("username password salt id displayName");
    if (!user) return responseHandler.badRequest(res, "User not exist");
    if (!user.validatePassword(password))
      return responseHandler.badRequest(res, "Password is incorrect");

    const token = jwt.sign({ data: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: "24h",
    });

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id,
    });
  } catch {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    console.log({ password, newPassword });
    const user = await userModel
      .findById(req.user.id)
      .select("password id salt");
    if (!user) responseHandler.unauthorized(res);
    if (!user.validatePassword(password))
      return responseHandler.badRequest(res, "Password is incorrect");
    user.setPassword(newPassword);
    await user.save();
    responseHandler.ok(res);
  } catch (e) {
    console.log("Error in updatePassword: ", e);
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return responseHandler.notFound(res);
    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signUp,
  signIn,
  getInfo,
  updatePassword,
};

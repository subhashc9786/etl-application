import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = user.generateAccessToken();
    await user.save({ validateBeforeSave: false });
    return { token };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = async (req, res) => {
  const { fullName, username, password } = req.body;
  if ([fullName, username, password].some((field) => field?.trim() === "")) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const existedUser = await User.findOne({
    $or: [{ username: username.toLowerCase() }],
  });
  console.log(existedUser);

  if (existedUser) {
    return res.status(409).json({ error: "User  already exists" });
  }

  const user = await User.create({
    fullName,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id);
  if (!createdUser) {
    return res
      .status(500)
      .json({ error: "Something went wrong while registering the user" });
  }

  return res
    .status(201)
    .json({ user, message: "User registered Successfully" });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).json({ error: "username or password is required" });
  }

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    return res.status(404).json({ error: "User does not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid user credentials" });
  }

  const { token } = await generateAccessToken(user._id);

  const loggedInUser = await User.findById(user._id);
  return res.status(201).json({
    user: loggedInUser,
    token,
    message: "User logged In Successfully",
  });
};

const findUserForFogotpassword = async (req, res) => {
  const userDetails = await User.findOne({ username: req.body.username });

  if (!userDetails) {
    return res.status(409).json({ error: "User  not found" });
  }

  const token = jwt.sign(
    { user: userDetails._id },
    process.env.FORGOT_PASSWORD_KEY,
    {
      expiresIn: "10m",
    }
  );

  return res.status(201).json({ token, message: "forgot password" });
};

const forgotPassword = async (req, res) => {
  let token = req.body.token;
  if (!token) {
    return res
      .status(404)
      .json({ error: "A token is required for authentication" });
  }
  let tokenVerfy;
  try {
    tokenVerfy = jwt.verify(token, process.env.FORGOT_PASSWORD_KEY);
  } catch (err) {
    return res.status(404).json({ error: `${err["message"]}` });
  }
  console.log('tokenVerfy',tokenVerfy);

  const loggedInUser = await User.findById({ _id: tokenVerfy.user });

  if (!loggedInUser) {
    return res.status(404).json({ error: "User not found !" });
  }
  const newPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.findByIdAndUpdate(
    { _id: tokenVerfy.user },
    { password: newPassword }
  );

  return res.status(201).json({ message: "User password updated" });
};

// throw new error('')

export { registerUser, loginUser, findUserForFogotpassword, forgotPassword };

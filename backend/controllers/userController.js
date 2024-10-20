import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

// User registration
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  console.log(req)
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill the full form!", 400));
  }

  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!", 400));
  }

  const user = await User.create({ name, email, phone, password, role });
  sendToken(user, 201, res, "User Registered Successfully!");
});

// User login
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  console.log(req)
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  if (user.role !== role) {
    return next(new ErrorHandler(`User with provided email and role ${role} not found!`, 404));
  }

  sendToken(user, 200, res, "User Logged In Successfully!");
});

// User logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully!",
    });
});

// Get user information
export const getUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

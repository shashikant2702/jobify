export const sendToken = (user, statusCode, res, message) => {
  // Generate JWT token
  const token = user.getJWTToken();

  // Set cookie options
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Set expiration time for the cookie
    httpOnly: true, // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === "production", // Set to true if in production to use https
    sameSite: "Strict" // Helps prevent CSRF attacks
  };

  // Send the token in the response as a cookie and as part of the JSON response
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token, // You might want to exclude the token from the response body if sending it in a cookie
  });
};

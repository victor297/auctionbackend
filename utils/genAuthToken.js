import jwt from "jsonwebtoken";

const genAuthToken = (user) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      userName: user.userName,
      isAdmin: user.isAdmin,
    },
    secretKey
  );
  return token;
};

export default genAuthToken;

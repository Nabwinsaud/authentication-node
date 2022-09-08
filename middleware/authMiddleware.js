import jwt from "jsonwebtoken";
import usersModel from "../model/Users.js";

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      console.log("Token is :", token);

      // verify token
      const { userId } = jwt.verify(token, process.env.JWT_TOKEN);
      //   console.log("User id is :", userId);

      // Get users from Token
      //   req.user = await usersModel.findById(userId).select("-password");
      req.user = await usersModel.findById(userId).select({ password: 0 });
      //   req.user = await usersModel.findById(userId).select("-password");
      // it will get all except password
      //   console.log(req.user);
      next();
    } catch (error) {
      res
        .status(401)
        .send({ status: "Failed", message: "unauthorized users !" });
    }
  }
  if (!token) {
    res.status(401).send({
      status: "Failed",
      message: "unauthorized user no token were found",
    });
  }
};

export default checkUserAuth;

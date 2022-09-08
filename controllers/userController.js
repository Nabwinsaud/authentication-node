import usersModel from "../model/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transporter from "../config/emailConfig.js";
export default class userController {
  async userRegistration(req, res) {
    const { name, email, password, confirm_password, checkbox } = req.body;

    const user = await usersModel.findOne({ email: email });
    if (user) {
      res.send({ status: "failed", message: "Email already exists" });
    } else {
      if (name && email && password && confirm_password && checkbox) {
        if (password === confirm_password) {
          try {
            const saltRound = 12;
            const salt = await bcrypt.genSalt(saltRound);
            const hashPassword = await bcrypt.hash(password, salt);
            const docs = new usersModel({
              name: name,
              email: email,
              password: hashPassword,
              checkbox: checkbox,
            });
            await docs.save();
            // implementing jwt
            const saved_user = await usersModel.findOne({ email: email });
            const token = jwt.sign(
              { userId: saved_user._id },
              process.env.JWT_TOKEN,
              {
                expiresIn: "5d",
              }
            );
            res.send({
              staus: "success",
              message: "User Registration successfull",
              token: token,
            });
          } catch (error) {
            res.send({ status: "Failed", message: "couldnot submit form" });
          }
        } else {
          res.send({ status: "failed", message: "Password doesnot match" });
        }
      } else {
        res.send("All fields are required");
      }

      // main els
    }
  }

  // user login

  async userLogin(req, res) {
    try {
      const { email, password } = req.body;
      // console.log(req.headers);
      if (email && password) {
        const user = await usersModel.findOne({ email: email });
        // console.log(user.email);
        if (user != null) {
          const passwordMatch = await bcrypt.compare(password, user.password);
          // console.log(user.password);
          if (user.email === email && passwordMatch) {
            // jwt token
            const token = jwt.sign(
              { userId: user._id },
              process.env.JWT_TOKEN,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login successfully !",
              token: token,
            });
          } else {
            res.status(401).send({
              status: "Failed",
              message: "Email or password doesnot match",
            });
          }
        } else {
          res
            .status(401)
            .send({ status: "Failed", message: "email is not registered" });
        }
      } else {
        res
          .status(401)
          .send({ staus: "Failed", message: "All the fields are required" });
      }
    } catch (error) {
      res.status(401).send({ status: "failed", message: "Couldnot login" });
    }
  }

  // change password
  async changeUserPassword(req, res) {
    const { password, confirm_password } = req.body;
    if (password && confirm_password) {
      if (password === confirm_password) {
        // hash password
        const hashRound = 12;
        const salt = await bcrypt.genSalt(hashRound);
        const newHashPassword = await bcrypt.hash(password, salt);
        // req.user._id comming from middleware
        await usersModel.findByIdAndUpdate(req.user._id, {
          $set: { password: newHashPassword },
        });
        res.send({
          status: "Success",
          message: "Password changed successfully !",
        });
      } else {
        res
          .status(201)
          .send({ status: "failed", message: "Password doesnot match" });
      }
    }
  }
  // stay login
  async stayLoginUser(req, res) {
    res.send({ "user ": req.user });
  }

  // reset password through email
  // async sendUserResetPassword(req, res) {
  //   const { email } = req.body;
  //   const user = await usersModel.findOne({ email: email });
  //   if (!user) {
  //     res
  //       .status(401)
  //       .send({ status: "Failed", message: "The email doesnot exist " });
  //   } else {
  //     const userId = user._id;
  //     const secret = userId + process.env.JWT_TOKEN;
  //     const token = jwt.sign({ userId: userId }, process.env.JWT_TOKEN, {
  //       expiresIn: "10m",
  //     });
  //     const resetLink = `http://localhost:3000/api/v1/user/reset-password/${userId}/${token}`;
  //     res.send({
  //       status: "success",
  //       message: "A reset password has sent thorugh your gmail check now",
  //       token: token,
  //       resetLink,
  //     });
  //   }
  // }

  // little if nesting
  async sendUserResetPassword(req, res) {
    const { email } = req.body;
    if (email) {
      const user = await usersModel.findOne({ email: email });
      if (user) {
        const userId = user._id;
        const secret = userId + process.env.JWT_TOKEN;
        const token = jwt.sign({ userId: userId }, secret, {
          expiresIn: "10m",
        });
        const resetLink = `http://localhost:3000/api/v1/user/reset-password/${userId}/${token}`;
        // send email
        const info = transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: user.email,
          subject: "Hustle Harder -Password reset",
          text: "click the link to reset your password",
          html: `
          <a href=${resetLink}>Reset your password </a>
          <a href=${resetLink}>${resetLink}</a>
          <p>Note:This link will be valid only for 15 minutes</p>
          `,
        });
        res.send({
          status: "success",
          message: "A reset password has sent thorugh your gmail check now",
          token: token,
          resetLink,
          info,
        });
      } else {
        res
          .status(401)
          .send({ status: "Failed", message: "Email doesnot exist " });
      }
    } else {
      res.status(401).send({ status: "Failed", message: "Email is required" });
    }
  }

  // send reset password after email sends

  async userResetPasswordAfterEmail(req, res) {
    const { password, confirm_password } = req.body;
    const { id, token } = req.params;
    // id and token comes as url so param is used to get id and token

    const user = await usersModel.findById(id);
    // finding through user id
    const access_token = user._id + process.env.JWT_TOKEN;
    try {
      jwt.verify(token, access_token);
      if (password && confirm_password) {
        if (password === confirm_password) {
          // hash password and update
          const genSalt = 12;
          const salt = bcrypt.genSalt(genSalt);
          const hashPassword = bcrypt.hash(password, salt);
          await usersModel.findByIdAndUpdate(user._id, {
            $set: { password: hashPassword },
          });
          res.send({
            status: "Success",
            message: "Password reset successfully",
          });
        } else {
          res.send({ status: "Failed", message: "Password doesnot match !" });
        }
      } else res.send({ status: "Failed", message: "All fields are required" });
    } catch (error) {
      res.send({ status: "Failed", message: "Invalid token" });
    }
  }
}

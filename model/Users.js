import mongoose from "mongoose";

// creating schema

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required field"],
    trim: true,
    minLength: 3,
    maxLength: 16,
  },
  email: {
    type: String,
    required: [true, "email is required field"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "password is required field"],
    trim: true,
  },
  //   password1: {
  //     type: String,
  //     required: [true, "confirm password is required"],
  //     trim: true,
  //   },
  checkbox: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

// definig model

const usersModel = mongoose.model("user", userSchema);

export default usersModel;

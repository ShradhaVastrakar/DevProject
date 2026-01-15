const express = require("express");
const { UserModel } = require("../models/userModel");
const { validateFields } = require("../../utils/validateSignupData");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/useAuth");

//signup
userRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, location, email, password, age } = req.body;
  try {
    validateFields(req);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new UserModel({
      firstName,
      lastName,
      location,
      email,
      password: passwordHash,
      age,
    });
    await user.save();
    res.send({ msg: "User Registred Successfully" });
  } catch (error) {
    res.send({ msg: "Error Registering User", error: error.message });
  }
});

//login
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //    console.log(email, password)
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credential");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // setting token

      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
      res.cookie("token", token);
      res.status(200).send("Login Successful");
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("ERROR: " + error);
  }
});

userRouter.get("/getUsers", async (req, res) => {
  try {
    // console.log("CONNECTED DB:", UserModel.db.name);
    console.log("COLLECTION:", UserModel.collection.name);
    const users = await UserModel.find();
    res.send({ users: users });
  } catch (error) {
    res.send({ msg: "Error getting User", error: error });
  }
});

userRouter.patch("/update/:id", async (req, res) => {
  try {
    validateFields(req);
    const newUserData = req.body;
    const { id } = req.params;

    await UserModel.findByIdAndUpdate(id, newUserData);

    res.send({ msg: "User Updated Successfully" });
  } catch (error) {
    res.send({ msg: "Error updating the user", error: error });
  }
});

userRouter.post("/logout", (req, res) => {
  try {
     res.cookie("token", null, {
      expires: new Date(Date.now())
     })

     res.send("Logout Successfully");
  } catch (error) {
    res.send("Error Logging Out")
  }
})

module.exports = {
  userRouter,
};

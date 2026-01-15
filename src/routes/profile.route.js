const express = require("express");
const { userAuth } = require("../middlewares/useAuth");
const validateProfileData = require("../../utils/validateProfileEditData");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (error) {
    res.send("Error fetching the profile " + error);
  }
  res.send("profile");
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData) {
      throw new Error("Invalid Edit request");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    
    res.send("Profile Updated Successfully");
  } catch (error) {
    res.status(400).send("ERROR: " + error);
  }
});

module.exports = {
  profileRouter,
};

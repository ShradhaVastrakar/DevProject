const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Please Login!");
    }

    const decodedMessage = await jwt.verify(token, process.env.SECRET_KEY);

    const { _id } = decodedMessage;

    const user = await UserModel.findById(_id);

    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (error) {
    res.send("Unauthenticated");
  }
};

module.exports = {
  userAuth,
};

const express = require("express");
const mongoose = require("mongoose");
const { userAuth } = require("../middlewares/useAuth");
const { connectionRequest } = require("../models/connectionRequest");
const { UserModel } = require("../models/userModel");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type" + status });
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid user id" });
      }

      const isUserExist = await UserModel.findById({ _id: toUserId });

      if (!isUserExist) {
        return res.status(400).json({ message: "User not found" });
      }

      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exist" });
      }

      const connectionRequestData = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequestData.save();

      res.json({
        message: "Connection request send.",
        data,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("ERR ", error);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // validate the status
      //
      const allowedStatus = ["rejected", "accepted"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed." });
      }

      const ConnectionRequest = await connectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!ConnectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found." });
      }

      ConnectionRequest.status = status;

      const data = ConnectionRequest.save();

      res.json({ message: "connection request" + status, data });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  },
);

module.exports = {
  requestRouter,
};

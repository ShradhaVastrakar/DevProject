const express = require("express")
const {UserModel} = require("../models/userModel");
const userRouter = express.Router()

userRouter.post("/register", async (req, res) => {
    try {
       const user = new UserModel(req.body);
       await user.save()
       res.send({msg: "User Registred Successfully"})
    } catch (error) {
        res.send({msg: "Error Registering User", "error": error})
    }
})

userRouter.get("/getUsers", async (req, res) => {
    try {
    // console.log("CONNECTED DB:", UserModel.db.name);
    console.log("COLLECTION:", UserModel.collection.name);
       const users = await UserModel.find()
       res.send({"users": users}) 
    } catch (error) {
        res.send({msg: "Error getting User", "error": error})
    }
})

userRouter.patch("/update/:id", async (req, res) => {
    try {
        const newUserData = req.body;
        const {id} = req.params;

        await UserModel.findByIdAndUpdate(id, newUserData)
      
        res.send({msg : "User Updated Successfully"})
    } catch (error) {
        res.send({msg: "Error updating the user", "error": error})
    }
})

module.exports = {
    userRouter
}
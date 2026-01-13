const express = require("express");
const { connectionDB } = require("./db")
const app = express();
const {userRouter} = require("./routes/user.route")

app.use(express.json())

app.use("/users", userRouter)

connectionDB
.then(() => {
  console.log("Connected to DB")
app.listen(8800, () => {
  console.log("Server starts at 8800 port");
});
})
.catch((err) => {
  console.log("Error conneccting to DB", err)
})








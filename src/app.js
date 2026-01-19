const express = require("express");
const { connectionDB } = require("./db")
const app = express();
const {userRouter} = require("./routes/user.route")
const cookies = require("cookie-parser");
const { profileRouter } = require("./routes/profile.route");
const { requestRouter } = require("./routes/request.route");


app.use(express.json())
app.use(cookies())

app.use("/users", userRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

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








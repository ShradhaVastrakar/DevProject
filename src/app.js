const express = require("express");

const app = express();



app.use("/test", (req, res) => {
    res.send("test")
})

app.listen(8800, () => {
  console.log("server starts at 8800 port")
})


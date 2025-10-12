const User = require("./models/UserModel");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+URL"
  )
  .then(async () => {
    const admin = new User({
      name:"",
      email: "",
      password: "",
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created!");
    process.exit();
  });


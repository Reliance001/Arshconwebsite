const User = require("./models/UserModel");
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Adedayo:Adedayo12154@projects.8j2dxit.mongodb.net/Projects?retryWrites=true&w=majority&appName=Projects"
  )
  .then(async () => {
    const admin = new User({
      name:"Adedayo",
      email: "admin@test.com",
      password: "Arshcon2025",
      role: "admin",
    });
    await admin.save();
    console.log("Admin user created!");
    process.exit();
  });

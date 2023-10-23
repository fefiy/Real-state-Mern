const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true, require: true },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
  },
  bookedVisits: { type: [mongoose.Schema.Types.Mixed] }, // Assuming you want an array of mixed types
  favResidenciesID: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Residency" },
  ], // Assuming you want an array of ObjectIds
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema); // Your Mongoose user model

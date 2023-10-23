const mongoose = require("mongoose");

// Residency Schema
const ResidencySchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  }, // Assuming "Int" from Prisma corresponds to a regular Number in Mongoose
  address: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  facilities: mongoose.Schema.Types.Mixed, // An array of mixed types, similar to Prisma's Json[]
  userEmail: {
    type: String,
    ref: 'User', // Referencing the 'User' model
    required: true,
    validate: {
      // Custom validation to ensure the email exists in the 'User' model
      validator: async function (value) {
        const user = await mongoose.model('User').findOne({ email: value });
        return user !== null;
      },
      message: 'User with this email does not exist.',
    },
  },// This field refers to the email in the User model
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

ResidencySchema.index({ address: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model("Residency", ResidencySchema);



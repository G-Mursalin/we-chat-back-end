const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

//Schema
const peopleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: 6,
    },
    imgURL: {
      type: String,
      required: [true, "Please provide your image"],
    },
    mobile: {
      type: String,
      required: [true, "Please provide your phone number"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Document Middleware:

// For password hashing
peopleSchema.pre("save", async function (next) {
  //Only run this function if password is modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});

// Instance Methods:

// peopleSchema.methods.isPasswordCorrect = async function (
//   candidatePassword,
//   userPasswordDb
// ) {
//   return await bcrypt.compare(candidatePassword, userPasswordDb);
// };

// Model
const People = mongoose.model("People", peopleSchema);

module.exports = People;

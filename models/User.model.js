const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Pet = require("./Pet.model");
const Veterinary = require("./Veterinary.model");
const Groomer = require("./Groomer.model");
const Residence = require("./Veterinary.Residence");
const Dogwalker = require("./Veterinary.Dogwalker");

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: "Email is required",
      lowercase: true,
      match: [EMAIL_PATTERN, "Email is not valid"],
      trim: true,
    },
    password: {
      type: String,
      required: "Password is required",
      match: [
        PASSWORD_PATTERN,
        "Your password must contain at least 1 number, 1 uppercase, 1 lowercase and 8 characters",
      ],
    },
    name: {
      type: String,
      required: "Name is required",
    },
    phone: {
      type: String,
    },
    address: [
      {
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        province: {
          type: String,
        },
        zip: {
          type: String,
        },
      },
    ],
    social: {
      google: {
        googleID: String,
        access_token: String,
        refresh_token: String,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    vets: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Profile",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_WORK_FACTOR).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

userSchema.virtual("pets", {
  ref: Pet.modelName,
  localField: "_id",
  foreignField: "user",
});
userSchema.virtual("veterinary", {
  ref: Veterinary.modelName,
  localField: "_id",
  foreignField: "pet",
});
userSchema.virtual("groomer", {
  ref: Groomer.modelName,
  localField: "_id",
  foreignField: "pet",
});
userSchema.virtual("residence", {
  ref: Residence.modelName,
  localField: "_id",
  foreignField: "pet",
});
userSchema.virtual("dogwalker", {
  ref: Dogwalker.modelName,
  localField: "_id",
  foreignField: "pet",
});

const User = mongoose.model("User", userSchema);

module.exports = User;

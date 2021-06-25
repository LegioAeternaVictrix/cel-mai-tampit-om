const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,

    },

    lastName: {
      type: String,

    },

    username: {
      type: String,
      unique: true,
      minlength: 4,

    },

    email: {
      type: String,
      required: [true, "Please provide your mail"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid mail"]
    },

    photo: {
      type: String,
      default: "default.jpg"
    },

    role: {
      type: String,
      enum: ["user", "teacher", "admin"],
      default: "user"
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
    
      select: false
    },

    passwordConfirm: {
      type: String,
     
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: "Passwords are not the same!"
      },
      select: false
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },

    theme: {
      type: String,
      default: "default"
    },

    registeredAt: {
      type: Date,
      default: Date.now
    }
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("courses", {
  ref: "Course",
  foreignField: "teacher",
  localField: "_id"
});

// userSchema.pre("save", async function(next) {
//   // Only run this function if password was actually modified
//   if (!this.isModified("password")) return next();

//   // Hash thhe password with cost of 12
//   this.password = await bcrypt.hash(this.password, 12);

//   // Delete passwordConfirm field
//   this.passwordConfirm = undefined;
//   next();
// });

userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

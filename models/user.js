import mongoose from "mongoose";
import gravatar from "gravatar";

const { Schema } = mongoose;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,

    default: function () {
      return gravatar.url(
        this.email,
        {
          s: "200",
          r: "pg",
          d: "mm",
        },
        true
      );
    },
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: "200", r: "pg", d: "mm" }, true);
    },
  },
});

const User = mongoose.model("user", userSchema);

export default User;

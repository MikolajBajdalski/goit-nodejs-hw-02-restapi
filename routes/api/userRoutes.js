import express from "express";
import { userSignup, updateAvatar } from "../../controllers/userController.js";
import authMiddleware from "#middlewares/authMiddleware.js";
import User from "#models/user.js";
import sendEmail from "../../config/mailgun-config.js";

const router = express.Router();

router.post("/signup", userSignup);

router.patch("/avatars", authMiddleware, updateAvatar);

router.get("/logout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
});

router.get("/current", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
});

router.get("/verify/:verificationToken", async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.verify = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/verify", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    }
    const verificationLink = `http://localhost:3000/users/verify/${user.verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `Please click on the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
    });
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;

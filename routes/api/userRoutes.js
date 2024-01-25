import express from "express";
import { userSignup } from "../../controllers/userController.js";
import authMiddleware from "#middlewares/authMiddleware.js";
import User from "#models/user.js";

const router = express.Router();

router.post("/signup", userSignup);

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

export default router;

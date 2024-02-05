import bcrypt from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import multer from "multer";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";

const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const userSignup = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.status(201).json({
      message: "User created",
      user: { email: user.email, avatarURL: user.avatarURL },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

const userLogin = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
const updateAvatar = async (req, res) => {
  const uploadSingle = upload.single("avatar");

  uploadSingle(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file provided" });
    }

    const avatarPath = path.join("tmp", req.file.filename);
    const image = await jimp.read(avatarPath);
    await image.resize(250, 250).quality(60).writeAsync(avatarPath);

    const newAvatarPath = path.join("public/avatars", req.file.filename);
    await fs.rename(avatarPath, newAvatarPath);

    const avatarURL = `/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user._id, { avatarURL });

    res.status(200).json({ avatarURL });
  });
};

export { userLogin, userSignup, updateAvatar };

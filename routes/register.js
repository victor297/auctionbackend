import bcrypt from "bcrypt";
import Joi from "joi";
import express from "express";
import User from "../models/user.js";
import genAuthToken from "../utils/genAuthToken.js";
import cloudinary from "../utils/cloudinary.js";

const register = express.Router();

register.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    userName: Joi.string().min(7).max(200).required(),
    password: Joi.string().min(3).max(200).required(),
    image: Joi.string().required(),
  });
  const { image } = req.body;

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ userName: req.body.userName });

  if (user) return res.status(400).send("user already exist");

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "veeshop",
      });

      if (uploadedResponse) {
        user = new User({
          name: req.body.name,
          userName: req.body.userName,
          password: req.body.password,
          image: uploadedResponse,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = genAuthToken(user);

        res.send(token);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default register;

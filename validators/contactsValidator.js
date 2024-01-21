import Joi from "joi.js";

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

export const validateContact = (contact) => contactsSchema.validate(contact);

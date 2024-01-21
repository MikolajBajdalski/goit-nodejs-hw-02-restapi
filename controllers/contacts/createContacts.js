import { addContact } from "../../models/contacts.js";

async function createContacts(req, res, next) {
  try {
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

export { createContacts };

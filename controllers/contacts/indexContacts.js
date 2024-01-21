import { listContacts } from "../../models/contacts.js";

async function indexContacts(req, res, next) {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

export { indexContacts };

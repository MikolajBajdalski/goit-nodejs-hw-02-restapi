const { addContact } = require("../../models/contacts");

async function createContacts(req, res, next) {
  try {
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  } catch (err) {
    next(err);
  }
}

module.exports = createContacts;

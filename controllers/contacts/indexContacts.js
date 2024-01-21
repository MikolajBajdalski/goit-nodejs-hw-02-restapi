const { listContacts } = require("../../models/contacts");

async function indexContacts(req, res, next) {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

module.exports = indexContacts;

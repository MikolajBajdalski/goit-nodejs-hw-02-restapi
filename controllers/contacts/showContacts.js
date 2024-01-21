const { getContactById } = require("../../models/contacts");

async function showContacts(req, res, next) {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

module.exports = showContacts;

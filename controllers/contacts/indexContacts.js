import Contact from "#models/contacts.js";

async function indexContacts(req, res, next) {
  try {
    const contacts = await Contact.find({});
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}

export { indexContacts };

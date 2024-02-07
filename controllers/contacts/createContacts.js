import Contact from "#models/contacts.js";

async function createContacts(req, res, next) {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    return res.status(201).json(newContact);
  } catch (err) {
    next(err);
  }
}

export default createContacts;

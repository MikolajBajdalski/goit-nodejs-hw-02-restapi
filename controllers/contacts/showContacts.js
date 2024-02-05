import Contact from "#models/contacts.js";

async function showContacts(req, res, next) {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

export default showContacts;

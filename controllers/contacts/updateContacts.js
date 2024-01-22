import Contact from "#models/contacts.js";

async function updateContacts(req, res, next) {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

export { updateContacts };

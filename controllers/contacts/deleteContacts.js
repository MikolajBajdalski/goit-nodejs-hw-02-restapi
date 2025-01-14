import Contact from "#models/contacts.js";

async function deleteContacts(req, res, next) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json({ message: "Contact deleted" });
  } catch (err) {
    next(err);
  }
}

export default deleteContacts;

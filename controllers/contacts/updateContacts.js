import { updateContact } from "../../models/contacts.js";

async function updateContacts(req, res, next) {
  try {
    const contact = await updateContact(req.params.contactId, req.body);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

export { updateContacts };

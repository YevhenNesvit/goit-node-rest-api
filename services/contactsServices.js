import Contact from "../models/contact.js";

async function listContacts() {
  try {
    const contacts = await Contact.findAll();
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error);
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const contact = await Contact.findByPk(contactId);
    
    if (!contact) {
      return null;
    }

    await contact.destroy();
    return contact;
  } catch (error) {
    console.error("Error removing contact:", error);
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
    });

    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

async function updateContact(contactId, data) {
  try {
    const contact = await Contact.findByPk(contactId);
    
    if (!contact) {
      return null;
    }

    const updatedContact = await contact.update(data);
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}

async function updateStatusContact(contactId, { favorite }) {
  try {
    const contact = await Contact.findByPk(contactId);
    
    if (!contact) {
      return null;
    }

    const updatedContact = await contact.update({ favorite });
    return updatedContact;
  } catch (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

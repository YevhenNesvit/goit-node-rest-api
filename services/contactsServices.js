import Contact from "../models/contact.js";

async function listContacts(userId, query = {}) {
  try {
    const { page = 1, limit = 20, favorite } = query;

    const options = {
      where: { owner: userId },
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    };

    // Додаємо фільтрацію за полем favorite, якщо вказано
    if (favorite !== undefined) {
      options.where.favorite = favorite === "true";
    }

    const contacts = await Contact.findAll(options);
    return contacts;
  } catch (error) {
    console.error("Error reading contacts:", error);
    throw error;
  }
}

async function getContactById(contactId, userId) {
  try {
    const contact = await Contact.findOne({
      where: { id: contactId, owner: userId },
    });
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
}

async function removeContact(contactId, userId) {
  try {
    const contact = await Contact.findOne({
      where: { id: contactId, owner: userId },
    });

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

async function addContact(name, email, phone, userId) {
  try {
    const newContact = await Contact.create({
      name,
      email,
      phone,
      owner: userId,
    });

    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

async function updateContact(contactId, data, userId) {
  try {
    const contact = await Contact.findOne({
      where: { id: contactId, owner: userId },
    });

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

async function updateStatusContact(contactId, { favorite }, userId) {
  try {
    const contact = await Contact.findOne({
      where: { id: contactId, owner: userId },
    });

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

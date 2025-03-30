import { fileURLToPath } from "url";
import fs from "fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts file:", error);
    return [];
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((item) => item.id === contactId);
    return contact || null;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);

    if (index === -1) {
      return null;
    }

    const [removedContact] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch (error) {
    console.error("Error removing contact:", error);
    return null;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const newContact = {
      id: Date.now().toString(),
      name,
      email,
      phone,
    };

    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return newContact;
  } catch (error) {
    console.error("Error adding contact:", error);
    return null;
  }
}

async function updateContact(contactId, data) {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);
    if (index === -1) {
      return null;
    }

    contacts[index] = { ...contacts[index], ...data };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
  } catch (error) {
    console.error("Error updating contact:", error);
    return null;
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

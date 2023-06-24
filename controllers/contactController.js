const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModels");
//get contact
//private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contacts);
});

//create contact
//private
const createContact = asyncHandler(async (req, res) => {
  console.log("the request body", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(201).json(contact);
});

//get contact
//private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(201).json(contact);
});

//update contact
//private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  console.log(`Hi its the contact ${contact}`);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  //update a contact for that user check
  if (contact.user.id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedContact);
});

//delete contact
//private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  //delete a contact for that user check
  if (contact.user.id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission to delete other user contacts");
  }
  await Contact.deleteOne({ id: req.params.id });
  res.status(200).json(contact);
});

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};

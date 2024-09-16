import { Customers } from "../models/customers.model.js";

const getCustomers = async (req, res) => {
  try {
    const customers = await Customers.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const addCustomer = async (req, res) => {
  try {
    const { email, name, phone } = req.body;

    if (![email, name].every((field) => typeof field === 'string' && field.trim() !== "")) {
      return res.status(400).json({ error: "All Fields are required" });
    }

    // Validate phone separately if it's supposed to be a number
    if (!phone || typeof phone !== 'string' || phone.trim() === "") {
      return res.status(400).json({ error: "Phone number is required" });
    }
    const existingCustomer = await Customers.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ error: "Customer with this email already exists" });
    }
    const newCustomer = new Customers({ email, name, phone });
    const customers = await newCustomer.save();
    res.status(201).json({ customers, message: "Customer added Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { email, name, phone } = req.body;
    const customer = await Customers.findByIdAndUpdate(req.params.id, {
      email,
      name,
      phone,
    });
    if (!customer)
      return res.status(404).json({ message: "Customesr not found" });
    res
      .status(200)
      .json({ customer, message: "Customer updated Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteCustomers = async (req, res) => {
  try {
    const customer = await Customers.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

export { getCustomers, addCustomer, updateCustomer, deleteCustomers };

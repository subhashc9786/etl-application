import mongoose from "mongoose";
const customersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});


export  const Customers = mongoose.model("Customers", customersSchema)

import { Router } from "express";
import { addCustomer, deleteCustomers, getCustomers, updateCustomer } from "../controllers/customers.controller.js";
const router = Router();


router.get('/customer', getCustomers);

router.post('/customer', addCustomer);

router.put('/:id', updateCustomer);

router.delete('/:id', deleteCustomers);

export default router;
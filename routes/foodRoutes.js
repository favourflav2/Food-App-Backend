import { Router } from "express";
import { getOrderDate, get_Desert, get_Pasta, get_Pizza, get_Popular, get_Salad, stripe_Payment } from "../controller/foodController.js";

const router = Router()

router.get('/allPopular',get_Popular)
router.get('/allPizza',get_Pizza)
router.get('/allSalad',get_Salad)
router.get('/allDesert',get_Desert)
router.get('/allPasta',get_Pasta)

router.post("/orderDate",getOrderDate)

router.post("/api/create-checkout-session",stripe_Payment)

export default router
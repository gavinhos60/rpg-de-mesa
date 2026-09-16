import { Router } from "express";
import {
  listShopsController,
  getShopController,
  createShopController,
  updateShopController,
  deleteShopController,
  createShopItemController,
  updateShopItemController,
  deleteShopItemController,
  deliverShopItemController,
  listDeliveriesController,
} from "../controllers/mercado.controller";

const router = Router({ mergeParams: true });

router.get("/shops", listShopsController);
router.get("/shops/:shopId", getShopController);
router.post("/shops", createShopController);
router.patch("/shops/:shopId", updateShopController);
router.delete("/shops/:shopId", deleteShopController);

router.post("/shops/:shopId/items", createShopItemController);
router.patch("/shops/:shopId/items/:itemId", updateShopItemController);
router.delete("/shops/:shopId/items/:itemId", deleteShopItemController);
router.post("/shops/:shopId/items/:itemId/deliver", deliverShopItemController);

router.get("/deliveries", listDeliveriesController);

export default router;

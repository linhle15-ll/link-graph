import { Router } from "express";
import { nodeController } from "../controller/index.js";
const router = Router();

router
  .route("/")
  .get(nodeController.getNodesByFileId)
  .post(nodeController.postNode)
  .delete(nodeController.deleteNodesByFileId);

router
  .route("/:id")
  .get(nodeController.getNodeById)
  .delete(nodeController.deleteNodeById);

export default router;

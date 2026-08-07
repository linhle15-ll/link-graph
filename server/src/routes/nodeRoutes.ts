import { Router } from "express";
import { nodeController } from "../controller/index.js";
const router = Router();

router
  .route("/")
  .get(nodeController.getNodesByFolderId)
  .post(nodeController.postNode)
  .delete(nodeController.deleteNodesByFolderId);

router
  .route("/:id")
  .get(nodeController.getNodeById)
  .patch(nodeController.updateNodeById)
  .delete(nodeController.deleteNodeById);

export default router;

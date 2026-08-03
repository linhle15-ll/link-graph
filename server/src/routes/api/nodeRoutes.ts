import { Router } from "express";
import { nodeController } from "../../controller/api/index.js";
import { authenticate } from "../../middleware/auth.js";
const router = Router();

router
  .route("/")
  .get(nodeController.getNodesByFileId)
  .post(authenticate, nodeController.postNode)
  .delete(nodeController.deleteNodesByFileId);

router
  .route("/:id")
  .get(authenticate, nodeController.getNodeById)
  .delete(authenticate, nodeController.deleteNodeById);

export default router;

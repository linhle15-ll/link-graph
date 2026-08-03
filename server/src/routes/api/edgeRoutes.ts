import { Router } from "express";
import { edgeController } from "../../controller/api/index.js";
import { authenticate } from "../../middleware/index.js";
const router = Router();

router
  .route("/")
  .get(authenticate, edgeController.getEdges)
  .delete(authenticate, edgeController.deleteEdgesByKnowledgeFileId)
  .post(authenticate, edgeController.postEdge);

router
  .route("/:id")
  .get(authenticate, edgeController.getEdgeById)
  .delete(authenticate, edgeController.deleteEdgeById);

export default router;

import { Router } from "express";
import { edgeController } from "../controller/index.js";
const router = Router();

router
  .route("/")
  .get(edgeController.getEdges)
  .delete(edgeController.deleteEdgesByKnowledgeFolderId)
  .post(edgeController.postEdge);

router
  .route("/:id")
  .get(edgeController.getEdgeById)
  .patch(edgeController.updateEdgeById)
  .delete(edgeController.deleteEdgeById);

export default router;

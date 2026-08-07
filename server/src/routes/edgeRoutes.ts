import { Router } from "express";
import { edgeController } from "../controller/index.js";
const router = Router();

router
  .route("/")
  .get(edgeController.getEdges)
  .delete(edgeController.deleteEdgesByKnowledgeFileId)
  .post(edgeController.postEdge);

router
  .route("/:id")
  .get(edgeController.getEdgeById)
  .delete(edgeController.deleteEdgeById);

export default router;

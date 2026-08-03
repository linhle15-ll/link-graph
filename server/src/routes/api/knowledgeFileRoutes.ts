import { Router } from "express";
import {
  knowledgeFileController,
  nodeController,
} from "../../controller/api/index.js";
import { authenticate } from "../../middleware/auth.js";
const router = Router();

router
  .route("/")
  .get(authenticate, knowledgeFileController.getAllKnowledgeFiles)
  .post(authenticate, knowledgeFileController.postKnowledgeFile)
  .delete(authenticate, knowledgeFileController.deleteKnowledgeFilesByUserId);

router
  .route("/:id")
  .get(authenticate, knowledgeFileController.getKnowledgeFileById)
  .delete(authenticate, knowledgeFileController.deleteKnowledgeFileById);

export default router;

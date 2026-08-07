import { Router } from "express";
import {
  knowledgeFileController,
  nodeController,
} from "../controller/index.js";
const router = Router();

router
  .route("/")
  .get(knowledgeFileController.getAllKnowledgeFiles)
  .post(knowledgeFileController.postKnowledgeFile)
  .delete(knowledgeFileController.deleteKnowledgeFilesByUserId);

router
  .route("/:id")
  .get(knowledgeFileController.getKnowledgeFileById)
  .delete(knowledgeFileController.deleteKnowledgeFileById);

export default router;

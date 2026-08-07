import { Router } from "express";
import { knowledgeFolderController } from "../controller/index.js";
const router = Router();

router
  .route("/")
  .get(knowledgeFolderController.getAllKnowledgeFolders)
  .post(knowledgeFolderController.postKnowledgeFolder)
  .delete(knowledgeFolderController.deleteKnowledgeFoldersByUserId);

router
  .route("/:id")
  .get(knowledgeFolderController.getKnowledgeFolderById)
  .delete(knowledgeFolderController.deleteKnowledgeFolderById);

export default router;

import { Router } from "express";
import { nodeController } from "../../controller/api/index.js";
const router = Router();

router.route("/").get(nodeController.getAllNodes).post(nodeController.postNode);

router
  .route("/:id")
  .get(nodeController.getNodeById)
  .delete(nodeController.deleteNodeById);

router.route("/bulk").delete(nodeController.deleteAllNodes);
export default router;

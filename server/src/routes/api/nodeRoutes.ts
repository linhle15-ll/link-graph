import { Router } from "express";
import { nodeController } from "../../controller/api/index.js";
const router = Router();

router.route("/").get(nodeController.getAllNodes);
router.route("/:id").get(nodeController.getNode);

export default router;

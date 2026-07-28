import { Router } from "express";
import { edgeController } from "../../controller/api/index.js";
const router = Router();

// validate request (query deconstruction)
router.route("/").get(edgeController.getAllEdges);

router.route("/:id").get(edgeController.getEdgeById);

export default router;

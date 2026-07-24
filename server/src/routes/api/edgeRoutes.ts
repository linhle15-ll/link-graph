import { Router } from "express";
import { getEdge } from "../../controller/api/edgeController.js";
import { edgeController } from "../../controller/api/index.js";
const router = Router();

// validate request (query deconstruction)
router.route("/").get(edgeController.getAllEdges);

router.route("/:id").get(edgeController.getEdge);

export default router;

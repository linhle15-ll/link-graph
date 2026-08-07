import { Router } from "express";
import edgeRouter from "./edgeRoutes.js";
import nodeRouter from "./nodeRoutes.js";
import knowledgeFileRouter from "./knowledgeFileRoutes.js";
import { Route } from "../types/index.js";

const router = Router();

const allRoutes: Route[] = [
  {
    path: "/edges",
    route: edgeRouter,
  },
  {
    path: "/nodes",
    route: nodeRouter,
  },
  {
    path: "/knowledgeFiles",
    route: knowledgeFileRouter,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

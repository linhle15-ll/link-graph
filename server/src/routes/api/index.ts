import { Router } from "express";
import edgeRouter from "./edgeRoutes.js";
import nodeRouter from "./nodeRoutes.js";

const router = Router();

type Route = { path: string; route: Router };

const allRoutes: Route[] = [
  {
    path: "/edges",
    route: edgeRouter,
  },
  {
    path: "/nodes",
    route: nodeRouter,
  },
];

allRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

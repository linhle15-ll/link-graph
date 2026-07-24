import { UserRepository } from "./userRepository.js";
import { NodeRepository } from "./nodeRepository.js";
import { EdgeRepository } from "./edgeRepository.js";
import { FileRepository } from "./fileRepository.js";

export const fileRepository = new FileRepository();
export const userRepository = new UserRepository();
export const nodeRepository = new NodeRepository();
export const edgeRepository = new EdgeRepository();

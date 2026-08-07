import { Node } from "database";
import { nodeRepository } from "../repository/index.js";
import { CreateNodeInput, UpdateNodeInput } from "../types/index.js";

export const getNodeById = async (id: number): Promise<Node | null> => {
  return await nodeRepository.getNode(id);
};

export const getNodesByFolderId = async (
  folderId: number,
): Promise<Node[] | null> => {
  return await nodeRepository.getNodesByFolderId(folderId);
};

export const postNode = async (
  input: CreateNodeInput,
): Promise<Node | null> => {
  const node = await nodeRepository.postNode(input);

  if (!node) {
    return null;
  }

  return node;
};

export const updateNodeById = async (
  id: number,
  input: UpdateNodeInput,
): Promise<Node | null> => {
  return nodeRepository.updateNodeById(id, input);
};

export const deleteNodeById = async (id: number): Promise<Node | null> => {
  return nodeRepository.deleteNodeById(id);
};

export const deleteNodesByFolderId = async (
  folderId: number,
): Promise<number | null> => {
  return nodeRepository.deleteNodesByFolderId(folderId);
};

import { Node } from "database";
import { nodeRepository } from "../repository/index.js";
import * as scrappingService from "./scrappingService.js";
import { compact, CreateNodeInput, UpdateNodeInput } from "../types/index.js";

export const getNodeById = async (id: number): Promise<Node | null> => {
  return await nodeRepository.getNode(id);
};

export const getNodesByFolderId = async (
  folderId: number,
): Promise<Node[] | null> => {
  return await nodeRepository.getNodesByFolderId(folderId);
};

export const postNode = async (
  knowledgeFolderId: number,
  link: string,
): Promise<Node | null> => {
  // if link already in db, ignore and print to log

  const scrapedData = await scrappingService.scrapeForMetaData(link);

  const input: CreateNodeInput = compact({
    knowledgeFolderId,
    link,
    title: scrapedData?.title ?? link,
    authors: scrapedData?.authors,
  });

  if (scrapedData?.source) {
    input.source = scrapedData?.source;
  }

  if (scrapedData?.contentSummary) {
    input.contentSummary = scrapedData?.contentSummary;
  }

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

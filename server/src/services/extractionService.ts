import { ExtractedNodeMetadata } from "../types/index.js";

/**
 * fetch the link and extract paper metadata like title, authors, source
 */
export const extractNodeMetadata = async (
  link: string,
): Promise<ExtractedNodeMetadata> => {
  return {
    title: "test title",
  };
};

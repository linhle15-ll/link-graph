export type CreateNodeInput = {
  title: string;
  knowledgeFileId: number;
  authors?: string[];
  source?: string;
  contentSummary?: string;
  link: string;
};

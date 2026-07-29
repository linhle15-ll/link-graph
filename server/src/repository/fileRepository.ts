import { prisma, KnowledgeFile } from "../utils/index.js";

export class FileRepository {
  public async creatFile(title: string, userId: number): Promise<number> {
    const file = await prisma.knowledgeFile.create({
      data: {
        title: title,
        userID: userId,
      },
    });
    return file.id;
  }
}

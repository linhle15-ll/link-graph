import { File } from "../generated/prisma/client.js";
import { prisma } from "../utils/index.js";

export class FileRepository {
  public async creatFile(title: string): Promise<number> {
    const file = await prisma.file.create({
      data: {
        title: title,
      },
    });
    return file.id;
  }
}

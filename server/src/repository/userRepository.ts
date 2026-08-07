import { prisma, User } from "database";

export class UserRepository {
  public async getUser(email: string, password: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: {
        email: email,
        password: password,
      },
    });
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<number> {
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: password,
      },
    });
    return user.id;
  }
}

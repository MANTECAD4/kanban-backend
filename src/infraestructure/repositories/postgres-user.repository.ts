import { RegisterUserDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { UserEntity } from "../../domain/entities";
import { UserRepository } from "../../domain/repositories";

export class PostgresUserRepository implements UserRepository {
  public register = async (registerUserDto: RegisterUserDto) => {
    const registeredUser = await prisma.user.create({
      data: registerUserDto,
    });
    const userEntity = new UserEntity({ ...registeredUser, boards: null });
    return userEntity;
  };
  public getByEmail = async (email: string): Promise<UserEntity | null> => {
    const rawUser = await prisma.user.findFirst({ where: { email } });
    return rawUser === null
      ? null
      : new UserEntity({ ...rawUser, boards: null });
  };

  public getById = async (userId: number): Promise<UserEntity | null> => {
    const rawUser = await prisma.user.findFirst({
      where: { id: userId },
    });

    return rawUser === null
      ? null
      : new UserEntity({ ...rawUser, boards: null });
  };
}

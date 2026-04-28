import { LoginUserDto, RegisterUserDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories";

export class PostgresAuthRepository implements AuthRepository {
  public register = async (registerUserDto: RegisterUserDto) => {
    const registeredUser = await prisma.user.create({
      data: registerUserDto,
    });
    const userEntity = new UserEntity(registeredUser);
    return userEntity;
  };
  public getByEmail = async (email: string): Promise<UserEntity | null> => {
    const rawUser = await prisma.user.findFirst({ where: { email } });
    return rawUser === null ? null : new UserEntity(rawUser);
  };

  public getById = async (userId: number): Promise<UserEntity | null> => {
    const rawUser = await prisma.user.findFirst({ where: { id: userId } });

    return rawUser === null ? null : new UserEntity(rawUser);
  };
}

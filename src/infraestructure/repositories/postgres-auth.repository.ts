import { LoginUserDto, RegisterUserDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repositories";

export class PostgresAuthRepository implements AuthRepository {
  public login = async (loginUserDto: LoginUserDto): Promise<UserEntity> => {
    throw new Error("not implemented yet");
  };
  public register = async (registerUserDto: RegisterUserDto) => {
    try {
      const registeredUser = await prisma.user.create({
        data: registerUserDto,
      });
      const userEntity = new UserEntity(registeredUser);
      return userEntity;
    } catch (error) {
      console.error({ error });
      throw CustomError.internalServer("Error while registering user");
    }
  };
  public getByEmail = async (email: string): Promise<UserEntity | null> => {
    const rawUser = await prisma.user.findFirst({ where: { email } });
    return rawUser === null ? null : new UserEntity(rawUser);
  };

  public getById = async (userId: number): Promise<UserEntity | null> => {
    try {
      const rawUser = await prisma.user.findFirst({ where: { id: userId } });

      return rawUser === null ? null : new UserEntity(rawUser);
    } catch (error) {
      console.error({ error });
      throw CustomError.internalServer("Error while registering user");
    }
  };
}

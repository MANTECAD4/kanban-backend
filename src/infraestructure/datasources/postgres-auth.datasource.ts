import { LoginUserDto, RegisterUserDto } from "../../application/dtos";
import { prisma } from "../../data/init-postgres";
import { AuthDatasource } from "../../domain/datasources";
import { UserEntity } from "../../domain/entities";
import { CustomError } from "../../domain/errors/custom-error";

export class PostgresAuthDatasource implements AuthDatasource {
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
      //   console.error({ error });
      throw CustomError.internalServer("Error while registering user");
    }
  };
  public getByEmail = async (email: string): Promise<UserEntity | null> => {
    const rawUser = await prisma.user.findFirst({ where: { email } });

    return rawUser === null ? null : new UserEntity(rawUser);
  };
}

import { LoginUserDto } from "../../application/dtos";
import { AuthDatasource } from "../../domain/datasources";
import { AuthRepository } from "../../domain/repositories";
import { RegisterUserDto } from "../../application/dtos/auth.dto";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly authDatasource: AuthDatasource) {}
  public login = async (loginUserDto: LoginUserDto) => {
    return await this.authDatasource.login(loginUserDto);
  };
  public register = async (registerUserDto: RegisterUserDto) => {
    return await this.authDatasource.register(registerUserDto);
  };
  public getByEmail = async (email: string) => {
    return await this.authDatasource.getByEmail(email);
  };
}

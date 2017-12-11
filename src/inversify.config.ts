import TYPES from './types';
import { Container } from 'inversify';
import { RegistrableController, UserController } from './controller';
import { UserRepository, UserRepositoryImpl } from './repository';
import { UserService, UserServiceImpl } from './service';

const container = new Container();

container.bind<RegistrableController>(TYPES.Controller).to(UserController);
container.bind<UserService>(TYPES.UserService).to(UserServiceImpl);
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);

export default container;

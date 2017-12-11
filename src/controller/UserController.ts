import { Application, NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { RegistrableController } from './RegisterableController';
import { UserService } from '../service/UserService';
import TYPES from '../types';
import { UserDTO } from '../entity/User';

@injectable()
export class UserController implements RegistrableController {
  private userService: UserService;

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }

  public register(app: Application): void {
    app.route('/users')
      .get(this.all)
      .post(this.save);

    app.route('/users/:id')
      .get(this.one)
      .delete(this.delete);
  }

  private async all(request: Request, response: Response, next: NextFunction) {
    const users: Array<UserDTO> = await this.userService.getUsers();

    response.send(JSON.stringify(users));
  }

  private async one(request: Request, response: Response, next: NextFunction) {
    const user: UserDTO = await this.userService.getUser(request.params['id']);

    response.send(JSON.stringify(user));
  }

  private async save(request: Request, response: Response, next: NextFunction) {
    const user: UserDTO = await this.userService.saveUser(request.body);

    response.send(JSON.stringify(user));
  }

  private async delete(request: Request, response: Response, next: NextFunction) {
    await this.userService.deleteUser(request.params['id']);

    response.send();
  }
}

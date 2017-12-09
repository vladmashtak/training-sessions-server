import { getRepository } from 'typeorm';
import { Application, NextFunction, Request, Response } from 'express';
import { RegistrableController } from './RegisterableController';
import { User } from '../entity/User';

export class UserController implements RegistrableController {
  private userRepository = getRepository(User);

  public register(app: Application): void {
  }

  private async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  private async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOneById(request.params.id);
  }

  private async save(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.save(request.body);
  }

  private async remove(request: Request, response: Response, next: NextFunction) {
    await this.userRepository.removeById(request.params.id);
  }
}
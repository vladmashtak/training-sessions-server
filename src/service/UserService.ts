import { injectable, inject } from 'inversify';
import { UserRepository } from '../repository/UserRepository';
import { UserDTO } from '../entity/User';
import TYPES from '../types';

export interface UserService {
  getUsers(): Promise<Array<UserDTO>>;
  getUser(id: number): Promise<UserDTO>;
  saveUser(user: UserDTO): Promise<UserDTO>;
  deleteUser(id: number): Promise<void>;
}

@injectable()
export class UserServiceImpl implements UserService {
  @inject(TYPES.UserRepository)
  private userRepository: UserRepository;

  public async getUsers(): Promise<Array<UserDTO>> {
    return await this.userRepository.findAll();
  }

  public async getUser(id: number): Promise<UserDTO> {
    return await this.userRepository.findOne(id);
  }

  public async saveUser(user: UserDTO): Promise<UserDTO> {
    return await this.userRepository.save(user);
  }

  public async deleteUser(id: number): Promise<void> {
    return await this.userRepository.remove(id);
  }
}

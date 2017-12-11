import { getRepository } from 'typeorm';
import { injectable } from 'inversify';
import { User, UserDTO } from '../entity/User';

export interface UserRepository {
  findAll(): Promise<Array<UserDTO>>;
  findOne(id: number): Promise<UserDTO>;
  save(user: UserDTO): Promise<UserDTO>;
  remove(id: number): Promise<void>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  private userRepository = getRepository(User);

  public async findAll(): Promise<Array<UserDTO>> {
    return await this.userRepository.find();
  }

  public async findOne(id: number): Promise<UserDTO> {
    return await this.userRepository.findOneById(id);
  }

  public async save(user: UserDTO) {
    return await this.userRepository.save(user);
  }

  public async remove(id: number): Promise<void> {
    return await this.userRepository.deleteById(id);
  }
}

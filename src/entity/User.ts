import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface UserDTO {
  id?: number;
  firstName: string;
  lastName: string;
  age: number;
}

@Entity()
export class User implements UserDTO {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

}

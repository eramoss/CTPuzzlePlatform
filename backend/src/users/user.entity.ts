import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column()
  password: string

  @Column({ unique: true })
  email: string

  @Column({ default: 'O' })
  gender: string

  @Column({ default: null })
  confirmationCode: string

}

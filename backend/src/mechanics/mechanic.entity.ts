import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class Mechanic {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  classDefinition: string

  @Column()
  responseClassDefinition: string

  @Column()
  scoreFunction: string

}

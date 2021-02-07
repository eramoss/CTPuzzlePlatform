import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Test {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name:string

}

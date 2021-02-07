import { Mechanic } from "src/mechanics/mechanic.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity()
export class Item {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  itemDefinition: string

  @ManyToOne(type => Mechanic)
  mechanic: Mechanic

}

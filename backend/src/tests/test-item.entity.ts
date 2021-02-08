import { Item } from "src/items/item.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Test } from "./test.entity";

@Entity()
export class TestItem {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Test)
  test: Test

  @ManyToOne(type => Item)
  item: Item

}

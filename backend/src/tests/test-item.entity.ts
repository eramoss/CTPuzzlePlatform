import { Item } from "src/items/item.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Test } from "./test.entity";

@Entity()
export class TestItem {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: false })
    order: number

    @ManyToOne(type => Test, { nullable: true, orphanedRowAction: 'nullify', onDelete: 'CASCADE' })
    test: Test

    @ManyToOne(type => Item, { nullable: false })
    item: Item

    countItemResponses: number = 0

}

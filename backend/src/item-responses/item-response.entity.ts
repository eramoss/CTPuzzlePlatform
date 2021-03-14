import Participation from "src/participation/participation.entity";
import { TestItem } from "src/tests/test-item.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ItemResponse {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => TestItem)
    testItem: TestItem

    @ManyToOne(type => Participation, { onDelete: 'CASCADE' })
    participation: Participation;

    @Column()
    response: string;

}
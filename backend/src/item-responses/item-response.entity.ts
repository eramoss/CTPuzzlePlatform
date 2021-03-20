import Participation from "src/participation/participation.entity";
import { TestItem } from "src/tests/test-item.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Score } from "./score.entity";

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

    @ManyToOne(type => Score, { cascade: true })
    score: Score;

    @DeleteDateColumn()
    deletedAt: Date

}
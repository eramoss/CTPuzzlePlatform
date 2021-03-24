import { Score } from "src/item-responses/score.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemTestCase } from "./item-test-case.entity";

@Entity()
export class ResponseTestCase {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    responseInstantiation: string

    @ManyToOne(type => ItemTestCase, { onDelete: 'CASCADE' })
    itemTestCase: ItemTestCase

    @Column({ nullable: true })
    expectedScore: number

    @Column({
        type: 'jsonb',
        default: () => "'{}'",
        nullable: false,
    })
    score: Score;

}
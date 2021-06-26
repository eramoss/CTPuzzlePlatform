import { Score } from "src/item-responses/score.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ItemTestCase } from "./item-test-case.entity";

@Entity({ orderBy: { position: 'ASC' } })
export class ResponseTestCase {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column()
    responseInstantiation: string

    @ManyToOne(type => ItemTestCase, { onDelete: 'CASCADE' })
    itemTestCase: ItemTestCase

    @Column({ default: 0 })
    position: number

    @Column({ nullable: true, default: 0, type: 'numeric' })
    expectedScore: number

    @Column({
        type: 'jsonb',
        default: () => "'{}'",
        nullable: false,
    })
    score: Score;

}
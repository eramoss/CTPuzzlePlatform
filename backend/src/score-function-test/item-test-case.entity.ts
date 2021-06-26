import { Mechanic } from "src/mechanics/mechanic.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResponseTestCase } from "./response-test-case.entity";

@Entity({ orderBy: { position: 'ASC' } })
export class ItemTestCase {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ default: 0 })
    position: number

    @Column()
    itemInstantiation: string

    @ManyToOne(type => Mechanic, { onDelete: 'CASCADE' })
    mechanic: Mechanic

    @OneToMany(type => ResponseTestCase, responseCase => responseCase.itemTestCase, { cascade: true })
    responseTestCases: ResponseTestCase[]

    @Column({ default: true, nullable: true })
    expanded: boolean


}
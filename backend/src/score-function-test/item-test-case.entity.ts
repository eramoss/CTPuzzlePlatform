import { Mechanic } from "src/mechanics/mechanic.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ResponseTestCase } from "./response-test-case.entity";

@Entity()
export class ItemTestCase {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    itemInstantiation: string

    @ManyToOne(type => Mechanic, { onDelete: 'CASCADE' })
    mechanic: Mechanic

    @OneToMany(type => ResponseTestCase, responseCase => responseCase.itemTestCase, { cascade: true })
    responseTestCases: ResponseTestCase[]


}
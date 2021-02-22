import { Test } from "../tests/test.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TestApplication {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: String

    @Column()
    url: String

    @ManyToOne(type => Test)
    test: Test

}
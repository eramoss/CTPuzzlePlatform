import { Test } from "../tests/test.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Participation from "src/participation/participation.entity";

@Entity()
export class TestApplication {

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(type => Participation, participation => participation.application, { cascade: ['insert', 'update',] })
    participations: Participation[]

    @Column()
    name: String

    @Column()
    url: String

    @Column()
    hash!: string

    @ManyToOne(type => Test)
    test: Test

    @DeleteDateColumn()
    deletedAt: Date

}
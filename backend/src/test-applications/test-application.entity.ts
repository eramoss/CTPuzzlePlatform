import { Test } from "../tests/test.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Participation from "src/participation/participation.entity";

export enum TestApplicationVisibility { "PUBLIC", "PRIVATE" }

@Entity()
export class TestApplication {

    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(type => Participation, participation => participation.application, { cascade: ['insert', 'update',] })
    participations: Participation[]
    countParticipations: number

    @ManyToOne(type => TestApplication, { nullable: true })
    controlApplication!: TestApplication

    @Column()
    name: string

    @Column()
    url: string

    @Column({ default: TestApplicationVisibility.PRIVATE, type: 'varchar' })
    visibility: TestApplicationVisibility

    @Column({ nullable: true })
    description: string

    @Column()
    hash!: string

    @ManyToOne(type => Test)
    test: Test

    @DeleteDateColumn()
    deletedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
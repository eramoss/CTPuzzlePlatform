import { Mechanic } from "src/mechanics/mechanic.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ nullable: true })
    thumbnail: string

    @Column({ default: false, nullable: false })
    isTutorial: boolean

    @Column()
    description: string

    @Column()
    itemDefinition: string

    @ManyToOne(type => Mechanic)
    mechanic: Mechanic

    @DeleteDateColumn()
    deletedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}

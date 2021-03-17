import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class ResearchGroup {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    /* @Column({ nullable: true })
    institution: string */

}
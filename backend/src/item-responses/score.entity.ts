import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Score {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    score: number

    @Column()
    max: number
}
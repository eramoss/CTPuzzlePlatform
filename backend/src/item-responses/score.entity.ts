import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Score {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'numeric', default:0})
    score: number

    @Column({type: 'numeric', default:0})
    max: number

    @Column({ nullable: true })
    message: string
}
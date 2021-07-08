import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Score {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'numeric', default: 0, precision: 6, scale: 2 })
    score: number

    @Column({ type: 'numeric', default: 0, precision: 6, scale: 2 })
    max: number

    @Column({ nullable: true })
    message: string

    @Column({ default: '{}' })
    json: string
}
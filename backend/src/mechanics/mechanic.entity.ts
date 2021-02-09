import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';


@Entity()
export class Mechanic {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column({ nullable: true })
    thumbnail: string

    @Column()
    classDefinition: string

    @Column()
    responseClassDefinition: string

    @Column()
    scoreFunction: string

    @ManyToOne(type => User, { nullable: false })
    user: User

}

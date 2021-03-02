import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

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

    @Column({ nullable: true })
    baseUrl: string = ''

    @Column()
    classDefinition: string

    @Column()
    responseClassDefinition: string

    @Column()
    scoreFunction: string

    @Column()
    itemInstantiation: string

    @Column()
    responseInstantiation: string

    @ManyToOne(type => User, { nullable: false })
    user: User

}

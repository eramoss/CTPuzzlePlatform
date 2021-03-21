import ResearchGroup from 'src/research-group/research-group.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from 'typeorm';

@Entity()
export class Mechanic {
    getResponseClassName(): string {
        let responseClassDefinition = this.responseClassDefinition;
        //Remove all between {}
        responseClassDefinition = responseClassDefinition.replace(/\{(.|\n)*\}/gm, '')
        //Remove class token
        responseClassDefinition = responseClassDefinition.replace('class', '');
        //Remove \n
        responseClassDefinition = responseClassDefinition.replace(/\n|\s/g, '');
        return responseClassDefinition;
    }

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

    @ManyToOne(type => ResearchGroup, { nullable: false })
    researchGroup: ResearchGroup

    @DeleteDateColumn()
    deletedAt: Date


}

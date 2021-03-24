import ResearchGroup from 'src/research-group/research-group.entity';
import { ItemTestCase } from 'src/score-function-test/item-test-case.entity';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

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

        responseClassDefinition.split('class').filter(it => it).map(clazz => clazz.substring(0, clazz.indexOf("{")))
        return responseClassDefinition;
    }

    getDeclaredClassesNames(): string[] {
        return this.responseClassDefinition
            .split('class')
            .filter(it => it)
            .map(clazz => clazz.substring(0, clazz.indexOf("{")).trim())
            .filter(name => !!name.length);
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

    @OneToMany(type => ItemTestCase, itemTestCase => itemTestCase.mechanic, { cascade: true })
    itemTestCases: ItemTestCase[]

    @ManyToOne(type => User, { nullable: false })
    user: User

    @ManyToOne(type => ResearchGroup, { nullable: false })
    researchGroup: ResearchGroup

    @DeleteDateColumn()
    deletedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date


}

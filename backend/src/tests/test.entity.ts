import ResearchGroup from "src/research-group/research-group.entity";
import { TestApplication } from "src/test-applications/test-application.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TestItem } from "./test-item.entity";
import { TestStatus } from './test-status-enum'

@Entity()
export class Test {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(type => TestItem, testItem => testItem.test, { cascade: ['insert', 'update', 'remove'] })
    items: TestItem[]

    @OneToMany(type => TestApplication, testApplication => testApplication.test)
    applications: TestApplication[]

    link: string

    @Column({ default: TestStatus.Closed })
    status: TestStatus

    @ManyToOne(type => ResearchGroup, { nullable: false })
    researchGroup: ResearchGroup

    @DeleteDateColumn()
    deletedAt: Date
}

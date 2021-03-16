import { TestApplication } from "src/test-applications/test-application.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

    
}

import { UserDataQuestion } from "src/participation/user-quiz.dto";
import ResearchGroup from "src/research-group/research-group.entity";
import { TestApplication } from "src/test-applications/test-application.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TestItem } from "./test-item.entity";
import { TestStatus } from './test-status-enum'

export type MomentOfQuizPresentation = "after-the-test" | "before-the-test";

@Entity()
export class Test {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ default: "after-the-test" })
    momentOfQuizPresentation:MomentOfQuizPresentation

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

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'{}'",
        nullable: true,
    })
    userDataToRequest!: UserDataQuestion[]
}


import { TestApplication } from "src/test-applications/test-application.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Participation {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, { nullable: false })
    user: User

    @Column({ nullable: true })
    finishedAt: Date

    @Column({ nullable: false, default: new Date() })
    startedAt: Date

    @ManyToOne(type => TestApplication, { nullable: true, onDelete: 'CASCADE' })
    application: TestApplication;

    @Column({ default: 0 })
    lastVisitedItemId: number

    @Column({ nullable: true })
    testAsJson: string

}
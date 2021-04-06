import { ItemResponse } from "src/item-responses/item-response.entity";
import { TestApplication } from "src/test-applications/test-application.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserQuizSession } from "./user-quiz.dto";

@Entity()
export default class Participation {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => User, { nullable: false })
    user: User

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({ nullable: true })
    finishedAt: Date

    @Column({ nullable: true })
    startedAt: Date

    @Column({ nullable: true })
    observations: string

    @ManyToOne(type => TestApplication, { nullable: true, onDelete: 'CASCADE' })
    application: TestApplication;

    @OneToMany(type => ItemResponse, itemResponse => itemResponse.participation, { cascade: true })
    itemResponses: ItemResponse[]

    addResponse(itemResponse: ItemResponse) {
        itemResponse.participation = this;
        this.itemResponses.push(itemResponse);
    }

    @Column({ default: 0 })
    lastVisitedItemId: number

    @Column({ nullable: true })
    test: string

    @DeleteDateColumn()
    deletedAt: Date

    @Column({
        type: 'jsonb',
        array: false,
        nullable: true,
    })
    userDataToRequest!: UserQuizSession

}
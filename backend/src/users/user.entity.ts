import ResearchGroup from 'src/research-group/research-group.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, DeleteDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin', STUDENT = 'student', SYSADMIN = 'sysadmin'
}

@Entity()
export class User {
    isSysAdmin(): boolean {
        return this.roles.length == 1 && this.roles[0] == UserRole.SYSADMIN
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({ nullable: true })
    hash: string

    @Column()
    password: string

    @Column({ unique: true })
    email: string

    @Column({ default: 'O' })
    gender: string

    @Column({ default: null })
    confirmationCode: string

    @Column({ nullable: true })
    recoverPasswordHash: string

    @ManyToOne(type => ResearchGroup, { cascade: ['insert'] })
    researchGroup: ResearchGroup

    @Column({
        type: 'jsonb',
        array: false,
        default: () => "'[]'",
        nullable: false,
    })
    roles: UserRole[] = [];

    addRole(userRole: UserRole) {
        if (this.roles.indexOf(userRole) == -1) {
            this.roles.push(userRole)
        }
    }

    @DeleteDateColumn()
    deletedAt: Date

}


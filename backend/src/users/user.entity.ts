import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    
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

}

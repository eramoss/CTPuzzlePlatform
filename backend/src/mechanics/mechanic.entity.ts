import ResearchGroup from 'src/research-group/research-group.entity';
import { ItemTestCase } from 'src/score-function-test/item-test-case.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Mechanic {
  getDeclaredClassesNames(): string[] {
    return this.responseClassDefinition
      .split('class')
      .filter((it) => it)
      .map((clazz) => clazz.substring(0, clazz.indexOf('{')).trim())
      .filter((name) => !!name.length);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true, default: '' })
  baseUrl: string;

  @Column()
  classDefinition: string;

  @Column()
  responseClassDefinition: string;

  @Column()
  scoreFunction: string;

  @Column()
  itemInstantiation: string;

  @Column()
  responseInstantiation: string;

  @OneToMany(() => ItemTestCase, (itemTestCase) => itemTestCase.mechanic, {
    cascade: true,
  })
  itemTestCases: ItemTestCase[];

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => ResearchGroup, { nullable: false })
  researchGroup: ResearchGroup;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

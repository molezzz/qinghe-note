import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Index, OneToMany, ManyToMany, JoinTable} from "typeorm"
import { Record } from "./Record";
import { Note } from "./Note";

@Entity()
export class Medicine extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  name: string

  //别名
  @Column({nullable: true})
  alias: string

  @Column({nullable: true})
  xingWei: string

  @Column({nullable: true})
  origin: string

  @Column({nullable: true})
  effect: string

  // 本经原文
  @Column('text', {nullable: true})
  benJing: string

  // 禁忌
  @Column('text', {nullable: true})
  taboo: string

  @Column('text', {nullable: true})
  paoZhi: string

  // 剂量
  @Column({nullable: true})
  dose: string

  @OneToMany(type => Note, note => note.medicine, {cascade: true})
  notes: Note[]

  @ManyToMany(type => Record)
  records: Record[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

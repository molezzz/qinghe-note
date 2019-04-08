import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Index, OneToMany, ManyToMany} from "typeorm"
import { Record } from "./Record"
import { Note } from "./Note"

@Entity('medicine')
export class Medicine extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Index()
  name: string

  @Column({nullable: true})
  key: string

  //别名
  @Column({nullable: true})
  alias: string
  
  // 英文名
  @Column({nullable: true})
  nameEn: string

  @Column({nullable: true})
  category: string

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

  // 线上图片
  @Column({nullable: true})
  onlineImg: string

  @OneToMany(type => Note, note => note.medicine, {cascade: true, eager: true})
  notes: Note[]

  @ManyToMany(type => Record)
  records: Record[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

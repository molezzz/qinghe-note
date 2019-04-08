import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, Index, OneToMany} from "typeorm"
import { Note } from "./Note"

export enum FormulaKind {
  CUSTOM = 0, // 自组方
  CLASSIC = 1 //经方
} 

@Entity('formula')
export class Formula extends BaseEntity {
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

  //
  @Column('tinyint', { default: FormulaKind.CUSTOM })
  kind: number

  @Column({nullable: true})
  category: string

  // 出处
  @Column({nullable: true})
  source: string

  // 功效
  @Column({nullable: true})
  effect: string

  @Column('text', {nullable: true})
  components: string
  // 主治
  @Column('text', {nullable: true})
  zhuZhi: string

  // 禁忌
  @Column('text', {nullable: true})
  taboo: string

  // 病机
  @Column('text', {nullable: true})
  bingJi: string

  // 运用
  @Column('text', {nullable: true})
  usage: string

  //煎法
  @Column('text',{nullable: true})
  jianFa: string

  // 附方
  @Column('text',{nullable: true})
  fuFang: string

  //释疑
  @Column('text',{nullable: true})
  faq: string

  // 方歌 
  @Column('text',{nullable: true})
  fangGe: string

  // 方剂分析表
  @Column('simple-json', { nullable: true })
  analysisTable: string

  // 线上图片
  @Column({nullable: true})
  onlineImg: string

  // 线上连接
  @Column({nullable: true})
  link: string

  @OneToMany(type => Note, note => note.formula, {cascade: true, eager: true})
  notes: Note[]

  // @ManyToMany(type => Record)
  // records: Record[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

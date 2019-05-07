import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm'
// import { Note } from "./Note"
import { Record } from './Record'
// import { Medicine } from './Medicine'


export enum CustomFormulaKind {
  ORAL = 0, // 内服
  EXTERNAL = 1, // 外敷
  BATH = 2 // 洗浴
}

@Entity('custom_formula')
export class CustomFormula extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('tinyint', { default: CustomFormulaKind.ORAL })
  kind: number
  // 方剂分析表
  @Column('simple-json', { nullable: true })
  analysisTable: string

  @Column('text', { nullable: true })
  rawData: string

  // 服用方法
  @Column('simple-json', { nullable: true })
  usage: string

  // 剂量
  dose: String

  // 医嘱
  @Column('text', { nullable: true })
  advice: String
  // @OneToMany(type => Note, note => note.customFormula, {cascade: true, eager: true})
  // notes: Note[]

  @ManyToOne(type => Record, record => record.customFormulas)
  record: Record

  // @ManyToMany(type => Medicine)
  // @JoinTable()
  // medicnes: Medicine[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

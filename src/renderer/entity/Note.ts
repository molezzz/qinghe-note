import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import { Medicine } from './Medicine'
import { Formula } from './Formula'
import { Record } from './Record';

export enum NoteKind {
  BOOK = 1, // 书
  ZHAO = 2, // 赵老师
  MY = 0 // 我自己
}

@Entity('note')
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  key: string

  @Column('text')
  content: string

  // 1 书本，2 老师， 3 我自己
  @Column('tinyint', { default: NoteKind.BOOK })
  kind: number

  @ManyToOne(type => Medicine, medicine => medicine.notes)
  medicine: Medicine

  @ManyToOne(type => Formula, formula => formula.notes)
  formula: Formula

  @ManyToOne(type => Record, record => record.notes)
  record: Record

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

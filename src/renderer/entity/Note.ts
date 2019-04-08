import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne} from 'typeorm'
import { Medicine } from './Medicine'
import { Formula } from './Formula'

@Entity('note')
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  key: string

  @Column('text')
  content: string

  // 1 书本，2 老师， 3 我自己
  @Column()
  kind: number

  @ManyToOne(type => Medicine, medicine => medicine.notes)
  medicine: Medicine

  @ManyToOne(type => Formula, formula => formula.notes)
  formula: Formula

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm'
import { Record } from './Record'

@Entity('member')
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string

  @Column()
  sex: boolean

  @Column()
  age: number

  @Column('datetime')
  birthday: Date

  @OneToMany(type => Record, record => record.member)
  records: Record[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

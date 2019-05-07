import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm'
import { Record } from './Record'

@Entity('member')
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  onlineId: number;

  @Column()
  name: string

  @Column()
  sex: boolean

  @Column({ nullable: true })
  age: number

  // 哪里人
  @Column({ nullable: true })
  area: string

  @Column('datetime', { nullable: true })
  birthday: Date

  // 一些无法转换的日期
  @Column({ nullable: true })
  birthdayRaw: string

  // 用于保存出生月份、时间、属相等零散信息
  @Column('simple-json', { nullable: true })
  exdata: string

  @OneToMany(type => Record, record => record.member)
  records: Record[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

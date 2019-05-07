import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany} from 'typeorm'
import { Member } from './Member'
import { Note } from './Note';
import { CustomFormula } from './CustomFormula';

@Entity('record')
export class Record extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    // 线上中一学堂小程序的ID
    onlineId: number;
    
    @Column({ nullable: true })
    sn: number;

    // 就诊时间
    @Column('datetime')
    treatmentAt: Date

    // 病情摘要
    @Column('text')
    summary: String

    // 舌象
    tongue: String
   
    // 面
    face: String

    // 脉
    pulse: String

    // 病机
    @Column('text')
    cause: String

    @OneToMany(type => Note, note => note.record)
    notes: Note[]

    @ManyToOne(type => Member, member => member.records)
    member: Member

    @OneToMany(type => CustomFormula, customFormula => customFormula.record)
    customFormulas: CustomFormula[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
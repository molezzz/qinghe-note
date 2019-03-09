import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany} from 'typeorm'
import { Member } from './Member'
import { Medicine } from './Medicine'
@Entity()
export class Record extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime')
    treatmentAt: Date

    @ManyToOne(type => Member, member => member.records)
    member: Member
    
    @ManyToMany(type => Medicine)
    @JoinTable()
    medicnes: Medicine[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

}
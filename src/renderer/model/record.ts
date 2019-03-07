import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm'

@Entity()
export class Record extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    treatmentAt: Date

}
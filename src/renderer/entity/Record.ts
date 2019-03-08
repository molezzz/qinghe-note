import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn} from 'typeorm'

@Entity()
export class Record extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('datetime', { name: 'treatment_at'})
    treatmentAt: Datetime

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Datetime

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Datetime

}
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class events {
    @PrimaryGeneratedColumn()
    eventid: number;
    @Column()
    event_name: string;
    @Column()
    description: string;
    @Column({ type: 'ntext' })
    image: string;
    @Column({ default: true })
    status: boolean;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @Column({ 'nullable': true })
    cuid: number;
    @Column({ 'nullable': true })
    muid: number;
}
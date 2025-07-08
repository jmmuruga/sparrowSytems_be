import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class GetInTouch {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    button_name: string;
    @Column()
    button_link: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @Column({ 'nullable': true })
    cuid: number;
    @Column({ 'nullable': true })
    muid: number;
}
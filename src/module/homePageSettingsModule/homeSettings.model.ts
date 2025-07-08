import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class homeSettings {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    visible: boolean;
    @Column({ nullable: true })
    categoryid: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @Column({ nullable: true })
    column_count: number;
    @Column({ nullable: true })
    row_count: number;
    @Column({ nullable: true })
    subcategoryid: number;
    @Column({ 'nullable': true })
    cuid: number;
    @Column({ 'nullable': true })
    muid: number;
}
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class GeneralSettings {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    products_per_page: number;
    @Column()
    column_count: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @Column({ 'nullable': true })
    cuid: number;
    @Column({ 'nullable': true })
    muid: number;
}
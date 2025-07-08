import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class RecentOffers {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    status: boolean;
    @Column()
    products_Id: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @Column({ 'nullable': true })
    cuid: number;
    @Column({ 'nullable': true })
    muid: number;
}
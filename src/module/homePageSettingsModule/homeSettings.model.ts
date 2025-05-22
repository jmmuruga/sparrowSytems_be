import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity ()
export class homeSettings {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    visible: boolean;
    @Column()
    category_Id: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
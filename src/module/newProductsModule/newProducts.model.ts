import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Newproducts {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    status: boolean;
    @Column()
    products_Limit: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
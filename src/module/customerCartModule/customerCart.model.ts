import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CustomerCart {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    productid: number;
    @Column()
    customerid: number;
    @Column()
    quantity: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
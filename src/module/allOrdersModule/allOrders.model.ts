import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class allOrders {
    @PrimaryGeneratedColumn()
    orderid: number;
    @Column()
    customer_name: string;
    @Column()
    total_amount: number;
    // @Column()
    // action_date: number;
    @Column({'nullable': true})
    cuid: number;
    @Column({'nullable': true})
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    @Column({default: true})
    status: boolean;
    @Column()
    mobile_number: string;
    @Column()
    Address: string;
    @Column()
    landmark: string;
    @Column()
    pincode: number;
    @Column()
    payment_method: string;
    @Column()
    quantity: number;
}

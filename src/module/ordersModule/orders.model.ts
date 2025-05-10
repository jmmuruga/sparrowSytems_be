import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class orders {
  @PrimaryGeneratedColumn()
  orderid: number;
  @Column()
  productid: number;
  @Column()
  customerid: number;
  @Column()
  quantity: number;
  @Column()
  total_amount: number;
  @Column()
  offer_price: number;
  @Column()
  payment_method: string;
  @Column()
  status: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

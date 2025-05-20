import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("orders")
export class orders {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({generated: false})
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
  @Column({ nullable: true })
  open_orders_date: Date;
  @Column({ nullable: true })
  processing_orders_date: Date;
  @Column({ nullable: true })
  failure_orders_date: Date;
  @Column({ nullable: true })
  canceled_orders_date: Date;
  @Column({ nullable: true })
  shipped_orders_date: Date;
  @Column({ nullable: true })
  closed_orders_date: Date;
  @Column({ nullable: true })
  delivery_orders_date: Date;
  @Column({nullable: true})
  return_orders_date: Date;
  @Column({'nullable': true})
  address_id: number;
}

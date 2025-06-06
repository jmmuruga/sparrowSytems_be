import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class customerDetails {
  @PrimaryGeneratedColumn()
  customerid: number;
  @Column()
  email: string;
  @Column()
  customername: string;
  @Column()
  customeraddress: string;
  @Column({ nullable: true })
  pincode: string;
  @Column()
  mobilenumber: string;
  @Column()
  password: string;
  @Column()
  confirmpassword: string;
  @Column({ default: 0 })
  orderCount: number;
  @Column({ nullable: true })
  cuid: number;
  @Column({ nullable: true })
  muid: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

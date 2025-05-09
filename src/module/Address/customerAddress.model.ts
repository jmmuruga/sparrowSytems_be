import { Column,CreateDateColumn,Entity,PrimaryGeneratedColumn,UpdateDateColumn } from "typeorm";


@Entity() export class customerAddress {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  customerid:number;
  @Column()
  door_no: string;
  @Column()
  house_name:string;
  @Column()
  street_name1:string;
  @Column()
  street_name2:string;
  @Column()
  place:string;
  @Column()
  post:string;
  @Column()
  taluk:string;
  @Column()
  district:string;
  @Column()
  pincode:string;
  @Column({nullable: true})
  cuid:number;
  @Column({nullable: true})
  muid:number;
  @CreateDateColumn({ name: "created_at"})
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
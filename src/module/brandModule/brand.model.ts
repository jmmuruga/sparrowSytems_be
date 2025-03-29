import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity()
export class BrandDetail {
  @PrimaryGeneratedColumn()
  brandid: number;
  @Column()
  brandname: string;
  @Column()
  servicecenter_name: string;
  @Column()
  description: string;
  @Column()
  servicecentre_address: string;
   @Column()
   pincode : string;
   @Column()
   city : string;
   @Column()
   state : string;
   @Column()
   country : string;
   @Column()
   contact_number  : string;
   @Column()
   mobile_number : string;
   @Column()
   customercare_number : string;
   @Column()
   tollfree_number : string;
   @Column()
   email: string;
   @Column()
   website  : string;
   @Column()
   brandimage  : string;
  @Column({ nullable: true })
  cuid: number;
  @Column({ nullable: true })
  muid: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
    user_name: any;
}

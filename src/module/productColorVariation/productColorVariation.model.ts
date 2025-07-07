import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class productColorVariation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  product_id: string;
  @Column()
  selected_productid: string;
  @Column()
  imageid: string;
  @Column()
  colour: string;
  @Column()
  colour_code: string;
  @Column({ nullable: true })
  cuid: number;
  @Column({ nullable: true })
  muid: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

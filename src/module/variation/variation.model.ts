import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";


@Entity()
export class variation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  variationGroupId:string;
  @Column()
  variationGroup: string;
  @Column()
  variationname: string;
  @Column()
  productid: string;
  @Column({ nullable: true })
  // rowId: string;
  // @Column({ default: true })
  status: boolean;
  @Column({ nullable: true })
  cuid: number;
  @Column({ nullable: true })
  muid: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

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
  variationid:string;
  @Column()
  variationGroup: string;
  @Column()
  name: string;
  @Column()
  itemId: string;
  @Column()
  rowId: string;
  @Column({ default: true })
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

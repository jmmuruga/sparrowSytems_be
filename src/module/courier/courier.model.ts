import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class courier {
  @PrimaryGeneratedColumn()
  courier_id: number;
  @Column()
  Courier_Name: string;
  @Column()
  Courier_Link: string;
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

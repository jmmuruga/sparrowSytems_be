import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class currentOpenings {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  JobName: string;
  @Column({type: 'text', nullable: true})
  Description: string;
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

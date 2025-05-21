import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class application {
  @PrimaryGeneratedColumn()
  application_id: number;
  @Column()
  jobtitle: string;
  @Column()
  name: string;
  @Column()
  contact_number: string;
  @Column()
  mail_id: string;
  @Column({type: 'text', nullable: true})
  Description: string;
  @Column({ default: true })
  count: boolean;
  @Column()
  file: string;
  @Column({ nullable: true })
  cuid: number;
  @Column({ nullable: true })
  muid: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
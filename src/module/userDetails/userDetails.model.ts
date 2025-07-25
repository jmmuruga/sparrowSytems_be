import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn()
  userid: number;
  @Column({ nullable: true })
  username: string;
  // @Column()
  // role: String;
  @Column()
  email: string;
  @Column()
  MobileNumber: string;
  @Column()
  userType: string;
  @Column()
  password: string;
  @Column()
  confirmPassword: string;
  @Column({ nullable: true })
  cuid: number;
  @Column({ nullable: true })
  muid: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

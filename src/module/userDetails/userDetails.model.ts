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
  // @Column()
  // user_name: string;
  // @Column()
  // role: String;
  @Column()
  e_mail: string;
  @Column()
  usertype: string;
  @Column()
  password: string;
  @Column()
  confirmpassword: string;
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

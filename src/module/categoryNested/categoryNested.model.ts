import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from "typeorm";

@Entity()
export class CategoryNested {
  @PrimaryGeneratedColumn()
  subcategoryid: number;
  @Column()
  categoryname: string;
  @Column()
  // parentcategory: string;
  // @Column()
  parentid: number;
  @Column()
  categoryicon: string;
  @Column({default: true})
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
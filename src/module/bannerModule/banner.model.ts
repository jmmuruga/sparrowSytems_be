import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class banner {
    @PrimaryGeneratedColumn()
    bannerid: number;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    link: string;
    @Column()
    image: string;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

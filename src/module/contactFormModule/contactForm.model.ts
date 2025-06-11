import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class contactDetails {
    @PrimaryGeneratedColumn()
    form_id: number;
    @Column()
    customer_name: string;
    @Column()
    customer_company: string
    @Column({ type: "varchar", length: 15 })
    mobileNumber: number;
    @Column()
    e_mail: string;
    @Column({ type: 'ntext' })
    message: string;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
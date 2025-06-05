import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class products {
    @PrimaryGeneratedColumn()
    productid: number;
    @Column()
    product_name: string;
    @Column()
    stock: string;
    @Column()
    brand_name: string;
    @Column()
    category_name: string;
    @Column()
    mrp: number;
    @Column()
    discount: number;
    @Column()
    offer_price: number;
    @Column()
    min_qty: number;
    @Column()
    max_qty: number;
    @Column()
    delivery_charges: string;
    @Column({ nullable: true })
    delivery_amount: number;
    @Column({ nullable: true })
    variation_group: string;
    @Column({ type: 'ntext' })
    description: string;
    @Column()
    terms: string;
    @Column({ nullable: true })
    delivery_days: string;
    @Column()
    warranty: string;
    @Column({ type: 'ntext' , nullable: true })
    document: string;
    @Column({ type: 'ntext' , nullable: true })
    image1: string;
    @Column({ type: 'ntext' , nullable: true })
    image2: string;
    @Column({ type: 'ntext' , nullable: true })
    image3: string;
    @Column({ type: 'ntext'  , nullable: true})
    image4: string;
    @Column({ type: 'ntext' , nullable: true })
    image5: string;
    @Column({ type: 'ntext' , nullable: true })
    image6: string;
    @Column({ type: 'ntext' , nullable: true })
    image7: string;
    @Column({ nullable: true })
    cuid: number;
    @Column({ nullable: true })
    muid: number;
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    @Column({default: true})
    status: boolean;

}
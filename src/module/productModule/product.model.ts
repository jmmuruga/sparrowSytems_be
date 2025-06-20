import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class products {
    @PrimaryGeneratedColumn()
    productid: number;
    @Column()
    product_name: string;
    @Column()
    stock: string;
    @Column({ nullable: true })
    brandid: number;
    @Column({ nullable: true })
    categoryid: number;
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
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    @Column({default: true})
    status: boolean;
    @Column({nullable: true})
    subcategoryid: number;
}
@Entity()
export class ProductNested {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    productid: number;
    @Column({ type: 'ntext' , nullable: true })
    image: string;
    @Column()
    image_title: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
}
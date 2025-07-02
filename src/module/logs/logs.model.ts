import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Logs{
    @PrimaryGeneratedColumn()
    logId : number;

    @Column()
    userId : number;

    @Column()
    userName : string;
    
    @Column()
    statusCode : number;
    
    @Column({'type' : 'ntext'})
    message : string;
  
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
}
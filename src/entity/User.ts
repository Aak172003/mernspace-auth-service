import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Tenant } from "./Tenant";

@Entity({ name: "users" })
export class User {
    // This means it is unique and index apply on this id, also it will auto-increment
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    // @Column({select:false}) -> if i do globally , so jaha jaha i need passwrod i need to mention {select:["password"]} ,
    // which means it extract only password fields from whole user resposne

    @Column()
    password: string;

    @Column()
    role: string;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;

    // It represents -> many user is related to one tenant
    @ManyToOne(() => Tenant)
    tenant: Tenant;
}

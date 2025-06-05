import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    // This means it is unique and index apply on this id, also it will auto-increment
    @PrimaryGeneratedColumn()
    id: number;
}

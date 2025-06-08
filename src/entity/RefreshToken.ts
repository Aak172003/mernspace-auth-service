// import { on } from "events";
// import { ref } from "process";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

// Technically we can store big string of refresh token in the database,
// But this is not a good practice , we can optimise this by storing only the id of the refresh token

// Create a record in the database for each refresh token
// And then we embeed the id of the refresh token in the cookie

// And then when any refresh token get and it has recod id so we will just check is this record exist in refreshtoken table based on   the id
// If it exists then we will allow the user to refresh the token
// If it does not exist then we will not allow the user to refresh the token

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    // If someone not logged out since long time so we will delte the refresh token if it is expired
    @Column({ type: "timestamp" })
    expiresAt: Date;

    // typeorm automatically create userId we don't need to give userId as key name
    // ManyToOne -> here we use this relation because if a single user loggedin in same application from multiple devices
    // So we have to store multiple refresh tokens for the same user
    // So we will create a record for each refresh token in the database

    // It represents -> many refresh tokens is related to one user
    @ManyToOne(() => User)
    user: User;

    @UpdateDateColumn()
    updatedAt: number;

    @CreateDateColumn()
    createdAt: number;
}

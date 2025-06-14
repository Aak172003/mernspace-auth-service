import { Request } from "express";
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    // ? represents that it is optional
    // also this is required only when admin create any manager user
    tenantId?: number;
}
export interface RegisterUserRequest extends Request {
    body: UserData;
}

// -------------------------------------------------- Mock Server JWKS --------------------------------------------------
export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;

        // this ? represents id is optional
        id?: string;
    };
}
export interface AuthCookie {
    accessToken: string;
    refreshToken: string;
}

export interface ITenant {
    name: string;
    address: string;
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}

export interface CreateUserRequest extends Request {
    body: UserData;
}

export interface LimitedUserData {
    firstName: string;
    lastName: string;
    role: string;
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData;
}

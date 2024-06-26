export interface IUser {
    id?: number;
    email?: string;
    pass: string;
    role: Roles;
}
export type Roles = 'admin' | 'client' | 'driver';

export interface IUserRequest {
    nameOrg?: string;
    fullName?: string;
    name?: string;
    client_id?: string;
    email: string;
    pass: string;
    role: Roles;
}

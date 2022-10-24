export interface PutUserDto {
    email: string;
    password: string;
    firstName: string;
    lastNamme: string;
    permissionFlags: number;
}
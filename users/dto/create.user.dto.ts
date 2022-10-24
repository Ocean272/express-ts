export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastNamme?: string;
    permissionFlag?: number;
}
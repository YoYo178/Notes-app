export interface User {
    id: string;
    username: string;
    displayName: string;
    email: string;
}

export interface UserUpdateFields {
    // username: string; // Immutable
    email: string;
    displayName: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}
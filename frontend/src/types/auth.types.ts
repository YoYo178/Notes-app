interface BaseAuthFields {
    username: string;
    password: string;
}

export type LoginFields = BaseAuthFields;

export interface RegisterFields extends BaseAuthFields {
    email: string;
    displayName: string;
    confirmPassword: string;
}
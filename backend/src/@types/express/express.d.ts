declare namespace Express {
    interface Request {
        user: {
            id: string;
            username: string;
            displayName: string;
            email: string;
        },
        recoveringUser: {
            id: string;
        }
    }
}
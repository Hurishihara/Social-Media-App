export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    bio: string | null;
    profile_picture: string | null;
    created_at: Date;
}
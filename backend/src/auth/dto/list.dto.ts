export class listDto {
        id: number;
        username: string;
        avatar: string;
        state: string;
        level: number;
        friends?: {
            id: number;
        }[];
        friendOf?: {
            id: number;
        }[];
}
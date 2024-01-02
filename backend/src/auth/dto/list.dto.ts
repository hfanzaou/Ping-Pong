export class listDto {
        id: number;
        username: string;
        avatar: string;
        state: string;
        friends?: {
            id: number;
        }[];
        friendOf?: {
            id: number;
        }[];
}
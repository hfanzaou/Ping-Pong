import { ChatService } from "./chat.service";
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getData(body: any): Promise<{
        login: string;
        id: number;
    }[]>;
}

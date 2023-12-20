import { PrismaService } from "src/prisma/prisma.service";
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getData(): Promise<{
        login: string;
        id: number;
    }[]>;
}

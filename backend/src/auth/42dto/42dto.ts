import { BlobOptions } from "buffer";
import { achDto } from "../dto/ach.dto";
import { JsInputValue, JsonObject } from "@prisma/client/runtime/library";

export class FTUser {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    twoFaAuth: boolean;
    achievement: any;
}
import { Global, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient {
	constructor() {
		super({
			datasources: {
				db: {
					url: "postgresql://postgres:2340@localhost:5432/nest?schema=public"
				}
			}
		})
	}
}
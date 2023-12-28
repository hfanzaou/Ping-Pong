import { Injectable } from '@nestjs/common';
import { Room } from '../share/interfaces';

@Injectable()
export class RoomService {
    private rooms: Room[];

    addRoom() {

    }

    async getRoomByName(roomName: string): Promise<number> {
        const roomIndex = this.rooms.findIndex((room) => room?.name === roomName)
        return roomIndex
    }
}

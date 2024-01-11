import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { match } from 'assert';
import { isInstance } from 'class-validator';
import { createReadStream, readFileSync } from 'fs';
import { of } from 'rxjs';
import { listDto, userDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prismaservice: PrismaService) {}

    ///USER INFO///

    async getOnline(id: number) {
        try {
            await this.prismaservice.user.update({
                where: {id: id},
                data: {
                    state: 'online'
                },
            })
        } catch(error) {
            throw new NotFoundException('USER NOT FOUND');
        }
    }

    async getOffline(id: number) {
        try {
            await this.prismaservice.user.update({
                where: {id: id},
                data: {
                    state: 'offline'
                },
            })
        } catch(error) {
            throw new NotFoundException('USER NOT FOUND');
        }
    }

    async getUserAvatar(id: number) {
        try {
            const avatar = await this.prismaservice.user.findUnique({
                where: {
                    id: id,
                }, select : {
                    avatar: true,
                    upAvatar: true,
                }
            })
            if (!avatar || !avatar.avatar)
                return "";
            if (avatar.upAvatar)
            {
                ////console.log(avatar.avatar);
                const file = readFileSync(avatar.avatar, 'base64');
                ////console.log(file.toString('base64'));
                return ("data:image/png;base64,"+ file.toString());
            }
            return (avatar.avatar);
        } catch(error) {
            if (error instanceof NotFoundException)
                throw HttpStatus.NOT_FOUND; 
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getUsername(id: number) {
        try {
            const user = await this.prismaservice.user.findUnique({
                 where: {
                     id: id
                 }, select: {
                     username: true,
                 }
             })
            if (!user)
                 throw new NotFoundException('USER NOT FOUND');
            return (user.username);
        } catch(error) {
            if (error instanceof NotFoundException)
                throw HttpStatus.NOT_FOUND;
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getProfile(id: number, name: string) {
        try {
           //console.log(name);
            if (!name)
            throw new NotFoundException('USER NOT FOUND');
            let user = await this.prismaservice.user.findUnique({
                where: {
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}},
                }, select: {
                    id: true,
                    username: true,
                    avatar: true,
                    achievement: true,
                    state: true
                }
            })
            if (!user)
                throw new NotFoundException('USER NOT FOUND');
            const avatar = await this.getUserAvatar(user.id);
            const matchhistory = await this.getMatchHistory(user.id);
            //console.log(matchhistory);
            const retuser = {
                usercard: {
                    username: user.username, 
                    avatar,
                    state: user.state,
                    level: user.id,
                },
                matchhistory,
                achievements: user.achievement
            }
            return retuser;
        } catch(error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
				//if (error.code === 'P2015')
					throw new NotFoundException('USER NOT FOUND');
            }
            throw error;
        }
    }
    async getTwoFaState(id: number)
    {
        try {
            const user = await this.prismaservice.user.findUnique({
                where: {
                    id: id
                }, select: {
                    twoFaAuth: true,
                }
            })
            return user.twoFaAuth;
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    ///friends, request and block lists///////
    async getUsersList(id: number) {
       // console.log(id);
        try {
            const users = await this.prismaservice.user.findMany({
                where: {
                    blockedFrom: {every: {id: {not: id}}},
                    blocked: {every: {id: {not: id}}},
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    state: true,
                    friends: {where: {id: id}, select: {id: true}},
                    friendOf: {where: {id: id}, select: {id: true}}
                } 
            });
           // console.log(users);
            return await this.extarctuserinfo(users, id);
        } catch(error) {
            console.log(error);
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getFriendsList(id: number)
    {
        try {
            const users = await this.prismaservice.user.findMany({
                where: {
                    blockedFrom: {every: {id: {not: id}}},
                    blocked: {every: {id: {not: id}}},
                    friends: {
                        some: {
                            id: id,
                        }
                    },
                    friendOf: {
                        some: {
                            id: id,
                        }
                    }
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    state: true
                }
            })
            return await this.extarctuserinfo(users, id);
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getFriendReq(id: number)
    {
        try {
            const users = await this.prismaservice.user.findMany({
                where: {    
                    NOT : {
                        friendOf: {some: {id: id}}
                    },
                    friends: {some: {id: id}}
                },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    state: true
                }
            })
            return await this.extarctuserinfo(users, id);
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async getBlocks(id: number)
    {
        try {
            const users = await this.prismaservice.user.findUnique({
                where: {id: id},
                select: {blocked: 
                    {select: {
                    id: true,
                    username: true,
                    avatar: true,
                    state: true
                }},
            }})
            return await this.extarctuserinfo(users.blocked, id);
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    ///ADD, ACCEPT AND BLOCK////
    async addFriend(id: number, name:string) {
        try {
            const user = await this.prismaservice.user.findUnique({
                where: {
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}},
                }
            });
            if (!user)
                throw new NotFoundException('USER NOT FOUND');
           // console.log(user);
            await this.prismaservice.user.update({
                where: {id: id},
                data: {friends: {
                    connect: {id: user.id}
                }}
            })
        } catch(error) {
            throw new NotFoundException('USER NOT FOUND');
        }
    }

    async acceptFriend(id: number, name: string) {
        console.log(name)
        try {
            const user = await this.prismaservice.user.findUnique({
                where: { 
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}},
                    friends: {some: {id: id}}
                }
            });
            if (!user)
                throw new NotFoundException('NO REQUEST')
            await this.prismaservice.user.update({
                where: {id: id},
                data: {friends: {
                    connect: {id: user.id}
                }}
            })
        } catch(error) {
				throw new NotFoundException('NO REQUEST');
        }
    }
    async blockUser(id: number, name: string) {
            
        try {
            const user = await this.prismaservice.user.findUnique({
                where: { 
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}}
                }
            });
            if (!user)
                throw new NotFoundException('USER NOT FOUND')
            await this.prismaservice.user.update({
                where: {id: id},
                data: {
                    blocked: {
                        connect: {username: name}
                    }, friends: {
                        disconnect: {username: name}
                    }, friendOf: {
                        disconnect: {username: name}
                    }
                }
            })
        } catch(error) {
            throw new NotFoundException('USER NOT FOUND');
        }
    }
    async inblockUser(id: number, name: string) {
        try {
            await this.prismaservice.user.update({
                where: {id: id},
                data: {
                    blocked: {
                       disconnect: {username: name},
                    },
                },
            })
        } catch(error) {
            throw new NotFoundException('USER NOT FOUND');
        }
    }
    async removeReq(id: number, name: string)
    {
        try {
            const user = await this.prismaservice.user.findUnique({
                where: { 
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}}
                }
            });
            if(!user)
                throw HttpStatus.NOT_FOUND;
            await this.prismaservice.user.update({
                where: {id: id},
                data: {friends: {
                    disconnect: {id: user.id}
                }}
            })
        } catch(error) {
            throw new NotFoundException('USER NOT FOUND');
        }
    }
    async removeFriend(id: number, name: string) {
        try {
            const user = await this.prismaservice.user.findUnique({
                where: { 
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}}
                }
            });
            if(!user)
                throw new NotFoundException('USER NOT FOUND');
            await this.prismaservice.user.update({
                where: {id: id},
                data: {friends: {
                    disconnect: {id: user.id}
                    },
                    friendOf: {
                        disconnect: {id: user.id}
                    }
                }
            })
        } catch(error) {
            throw error;
        }
    }
    ///Achievements////
    // async addAchievement(id: number, achievement: boolean) {
    //     try { 
    //         await this.prismaservice.achievement.update({
    //             where: {
    //                 userId: id
    //             }, data: {
    //                achievement: true,
    //             }

    //         })
    //         const user = await this.prismaservice.user.findUnique({
    //             where: {id: id},
    //             select: {id: true, achievement: true}
    //         })
    //         console.log(user);
    //     } catch(error) {
    //         throw HttpStatus.INTERNAL_SERVER_ERROR;
    //     }
    // }
    async getAchievements(id: number)
    {
        try {
            const ach = await this.prismaservice.user.findUnique({
                where : {id: id},
                select: {achievement: true}
            })
            return ach.achievement;
        } catch(error) {
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    async addAchievement(id: number, achievement: any)
    {
        try {
            await this.prismaservice.user.update({
                where : {id: id}, data : {achievement: achievement}
            })
        } catch(error){

        }    
    }
    ////extartacting user info functions////
    async extarctuserinfo(users: listDto[], id: number)
    {
            const usersre: userDto[] = await Promise.all(users.filter((obj) => {
                if (obj.id != id) {
                    return true
                }
                return false;
              }).map(async (obj) => {
                const avatar = await this.getUserAvatar(obj.id);
                let friendship: string;
                if (obj.friends && obj.friendOf)
                {
                    friendship = obj.friends[0] && obj.friendOf[0] ? "remove friend":
                    !obj.friends[0] && obj.friendOf[0] ? "remove request": 
                    obj.friends[0] && !obj.friendOf[0] ? "accept friend": "add friend";
                }
                return { level: obj.id, name: obj.username, avatar: avatar, state: obj.state, friendship };
              }));
            //    const to_cons = usersre;
            //    let i = 0;
            //   while (to_cons[i])
            //   {
            //     delete to_cons[i].avatar;
            //     console.log(to_cons[i]);
            //     i++;
            //   }
                return (usersre);     
    }

    /////match history/////
    async getMatchHistory(id: number)
    {
        try {
            const matchhistory = await this.prismaservice.matchHistory.findMany({
                where : {
                    OR: [
                        {playerId: id},
                        {player2Id: id}
                    ]},
                select : {players: {where: {
                        NOT: {id: id},
                }, select: {id: true, username: true }}, playerId: true, playerScore: true, player2Score: true, win: true},
            })
            if (!matchhistory)
                return [];
            console.log(matchhistory);
            const to_send = await Promise.all(matchhistory.map(async (obj) => {
               // console.log(obj.players[0].id);
                const avatar = await this.getUserAvatar(obj.players[0].id);
                return { 
                    playerScore: obj.playerScore, 
                    player2Score: obj.player2Score, 
                    win: id === obj.playerId ? true: false,
                    avatar: avatar,
                    username: obj.players[0].username
                };
              }));
            //console.log(to_send);
            return to_send;
        } catch(error) {
            //if (error.instanceof(this.prismaservice))
                
            throw HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    // async addMatchHistory(id: number, name: string) {
    //     try {
    //         const user = await this.prismaservice.matchHistory.update({
    //             data: {
    //                 player
    //         })
    //     } catch(error)
    //     {

    //     }
    // }
}
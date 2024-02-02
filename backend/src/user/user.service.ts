import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { match } from 'assert';
import { isInstance } from 'class-validator';
import { createReadStream, readFileSync } from 'fs';
import { of } from 'rxjs';
import { listDto, userDto } from 'src/auth/dto';
import { notifDto } from 'src/auth/dto/notif.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { resourceLimits } from 'worker_threads';

@Injectable()
export class UserService {
    constructor(private prismaservice: PrismaService) {}

    ///USER INFO///
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
                const file = readFileSync(avatar.avatar, 'base64');
                return ("data:image/png;base64,"+ file.toString());
            }
            return (avatar.avatar);
        } catch(error) {
            if (error instanceof NotFoundException)
                throw HttpStatus.NOT_FOUND;
            return "";
        }
    }
    async getUsername(id: number) {
        try {
            const user = await this.prismaservice.user.findUnique({
                 where: {
                     id: id
                 }, select: {
                     username: true,
                     achievement: true,
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
                    state: true,
                    level: true,
                    win: true,
                    loss: true,
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
                    level: user.level.toFixed(2),
                    win: user.win,
                    loss: user.loss,
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
    async getLevel(id: number)
    {
        try {
            const user = await this.prismaservice.user.findUnique({
                where: {
                    id: id
                }, select: {
                    level: true,
                    win: true,
                    loss: true,
                }
            })
            return user;
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
                    level: true,
                    friends: {where: {id: id}, select: {id: true}},
                    friendOf: {where: {id: id}, select: {id: true}}
                } 
            });
            
           // console.log(users);
            return await this.extarctuserinfo(users, id);
        } catch(error) {
            // console.log(error);
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
                    state: true,
                    level: true,
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
                    state: true,
                    level: true,
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
                    state: true,
                    level: true,
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
        // console.log(name)
        try {
            const user = await this.prismaservice.user.findUnique({
                where: { 
                    username: name,
                    blocked: {every: {id: {not: id}}},
                    blockedFrom: {every: {id: {not: id}}},
                    friends: {some: {id: id}}
                }, select: {
                    id: true,
                    friends: true,
                    friendOf: true,
                }
            });
            if (!user)
                throw new NotFoundException('NO REQUEST')
            const auser = await this.prismaservice.user.update({
                where: {id: id},
                data: {friends: {
                    connect: {id: user.id}
                }}, select: {id: true, friends: true, friendOf: true}
            })
            if (user.friends.length == 1)
                this.updateAch(user.id, "firstFriend");
            if (auser.friends.length == 1)
                this.updateAch(auser.id, "firstFriend");
            await this.prismaservice.notifications.deleteMany({
                where: {
                    userId: id,
                    senderId: user.id,
                    type: "friend request"
                }
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
                    },
                    chatUsers: {
                        disconnect: {username: name}
                    },
                    chatUsersOf: {
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
            });
            const user = await this.prismaservice.user.findUnique({
                where: { id: id }
            });
            const   chatHistorie = await this.prismaservice.cHATHISTORY.findFirst({
                where: {
                    OR: [
                        {
                            name: `&${user.username}${name}`
                        },
                        {
                            name: `&${name}${user.username}`
                        }
                    ]
                }
            });
            if (chatHistorie) {
                await this.prismaservice.user.update({
                    where: {id: id},
                    data: {
                        chatUsers: {
                            connect: {username: name},
                        },chatUsersOf: {
                            connect: {username: name},
                        },
                    },
                })
            }
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
            await this.prismaservice.notifications.deleteMany({
                where: {
                    userId: user.id,
                    senderId: id,
                    type: "friend request"
                }
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
    async getAchievements(id: number)
    {
        try {
            const ach = await this.prismaservice.user.findUnique({
                where : {id: id},
                select: {achievement: true}
            })
            return ach.achievement;
        } catch(error) {
            throw new BadGatewayException('ERROR GETTING DATA');
        }
    }
    async addAchievement(id: number, achievement: any)
    {
        try {
            await this.prismaservice.user.update({
                where : {id: id}, data : {achievement: achievement}
            })
        } catch(error) {
            throw new BadGatewayException('ERROR UPDATING DATA');
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
                return { level: parseFloat(obj.level.toFixed(2)), name: obj.username, avatar: avatar, state: obj.state, friendship, win: obj.win, loss: obj.loss };
              }));
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
                    ]},orderBy: {createAt: 'desc'},
                select : {players: {where: {
                        NOT: {id: id},
                }, select: {id: true, username: true }}, playerId: true, playerScore: true, player2Score: true},
            })
            if (!matchhistory)
                return [];
            //console.log(matchhistory);
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
            return to_send;
        } catch(error) {
            throw new BadGatewayException('ERROR GETTING DATA');
        }
    }
    
    async addMatchHistory(id: number, result: {name: string, playerScore: number, player2Score: number}) {
        try {
           // console.log(result);
            const loserid = await this.prismaservice.user.findUnique({
                where: {username: result.name},
                select: {id: true},
            })
            await this.prismaservice.matchHistory.create({
                data: {
                    players: {connect: [{id: id}, {username: result.name}]},  
                    playerId: id,
                    player2Id: loserid.id,
                    playerScore: result.playerScore,
                    player2Score: result.player2Score,

                }    
            })
            this.toUpdatelevel(id, result.name);
        } catch(error) {
            // console.log(error);
            throw new BadGatewayException('ERROR UPDATING DATA');
        }
    }

    async addNotification(id: number, payload: notifDto)
    {
        try {
            // if (payload.type === "remove request")
            //     return ;
            // const already = await this.prismaservice.notifications.findMany({
            //     where: {
            //         user: {username: payload.reciever},
            //         senderId: id,
            //         type: payload.type,
            //     }
            // })
            // console.log(already)
            // console.log(payload);
            // if (!already[0] || payload.type == "groupInvite" || payload.type == "chat" || payload.type == "groupChat" || payload.type == "accept friend")
            // {
                if (payload.type == "groupInvite") {
                    await this.prismaservice.notifications.create({
                        data: {
                            user: {connect: {username: payload.reciever}},
                            senderId: id,
                            type: payload.type,
                            groupname: payload.groupname
                        }
                    })
                    return ;
                }
                // console.log(payload);
                await this.prismaservice.notifications.create({
                    data: {
                        user: {connect: {username: payload.reciever}},
                        senderId: id,
                        type: payload.type,
                        //groupname: payload.groupname
                    }
                })
            // }
        } catch(error) {
            // console.log(error);
            throw new BadGatewayException('ERROR UPDATING DATA');
        }
    }

    async getNotification(id: number)
    {
        try {
            const notif = await this.prismaservice.notifications.findMany({
                where: {
                    userId: id,
                },orderBy: {createAt: 'desc'},
                select: {senderId: true, type: true, groupname: true}
            })
            const notification = await Promise.all(notif.map(async (obj) => {
                const username = await this.getUsername(obj.senderId);
                const avatar = await this.getUserAvatar(obj.senderId);
                return {username, avatar, type: obj.type, groupname: obj.groupname}
            }))
            return (notification);
        } catch(error) {
            throw new BadGatewayException('ERROR GETTING DATA');
        }
    }
    async updatelevel(id: number, newLevel: number, win: number, loss: number)
    {
        await this.prismaservice.user.update({
            where : {id: id},
            data : {level: newLevel, win: win, loss: loss}
         });
    }
    async updateAch(id: number, ach: string)
    {
        let user = await this.prismaservice.user.findUnique({
            where: {id: id},
            select: {achievement: true}
        })
        // console.log(user.achievement);
        // console.log(user.achievement[ach]);
        user.achievement[ach] = true,
        await this.prismaservice.user.update({
            where : {id: id},
            data : {achievement: user.achievement},
        })
    }
    async addLeaderAch(id: number, name: string)
    {
        const arr = (await this.leaderBoard()).slice(0, 2);
       for (let i = 0; i < 2 ; i++)
       {
            if (name == arr[i].name)
                this.updateAch(id, "lead" + (i+1).toString());
            // console.log(arr[0].name);
       }
       //console.log(arr);
    }

    async toUpdatelevel(winId: number, lossName: string)
    {
        try {
           const winner =  await this.prismaservice.user.findUnique({
                where: {id: winId},
                select: {
                    username: true,
                    id: true,
                    level: true,
                    win: true,
                    loss: true,
                }
            })
            if (winner.level == 0)
                this.updateAch(winner.id, "firstMatch");
            this.updatelevel(winId,  (winner.level + 0.25 / (winner.level + 1)), ++winner.win, winner.loss);
            this.addLeaderAch(winner.id, winner.username);
            const loser =  await this.prismaservice.user.findUnique({
                where: {username: lossName},
                select: {
                    username: true, 
                    id: true,
                    level: true,
                    win: true,
                    loss: true,
                }
            });
            if (loser.level == 0)
                this.updateAch(loser.id, "firstMatch");
            this.updatelevel(loser.id,  (loser.level + 0.10 / (loser.level + 1)), loser.win, ++loser.loss);
            this.addLeaderAch(loser.id, loser.username);
        } catch(error) {
            throw new BadGatewayException('ERROR UPDATING DATA');
        }
    }
    async leaderBoard()
    {
        try {
            const users = await this.prismaservice.user.findMany({
                orderBy : {level: 'desc'},
                select: {
                    id: true,
                    state: true,
                    username: true, 
                    avatar: true,
                    level: true,
                    win: true,
                    loss: true
                }  
            })
            const to_send = await this.extarctuserinfo(users, 0);
            return to_send;
        }
        catch(error) {
            throw new BadGatewayException('ERROR GETTING DATA');
        }
    }
}

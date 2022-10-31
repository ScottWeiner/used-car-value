import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from '../user.entity'

declare global {
    namespace Express {
        interface Request {
            currentUser?: User
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {

        const { userId } = req.session || {}

        if (userId) {
            const user = await this.usersService.findOne(userId)
            if (!user) {
                throw new NotFoundException(`User with ID: ${userId} not found!`)
            }

            req.currentUser = user
        }

        next()


    }

}
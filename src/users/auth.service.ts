import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {

    constructor(private usersService: UsersService) { }

    async signup(email: string, password: string) {
        //check if there is a user already with that email, and if so, throw and error
        const existingUser = await this.usersService.find(email)
        if (existingUser.length > 0) {
            throw new BadRequestException('Email already in use')
        }

        //hash the users password
        // 1) generate salt
        const salt = randomBytes(8).toString('hex')

        // 2) hash the salt and password together
        const hash = await scrypt(password, salt, 32) as Buffer

        // 3) join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex')

        //then feed arguments to the usersService methods that allow for user creation
        const newUser = await this.usersService.create(email, result)

        //return the user
        return newUser
    }

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email)
        if (!user) {
            throw new NotFoundException('User Not found!')
        }

        const [salt, hash] = user.password.split('.')

        const hashCompare = await scrypt(password, salt, 32) as Buffer

        if (hashCompare.toString('hex') !== hash) {
            throw new BadRequestException('Incorrect Password Supplied')
        }
        return user
    }

}
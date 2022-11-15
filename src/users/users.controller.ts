import { Controller, Post, Get, Patch, Body, Param, Query, Delete, NotFoundException, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './DTOs/create-user.dto'
import { UpdateUserDto } from './DTOs/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize-interceptor';
import { UserDto } from './DTOs/user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';



@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService: AuthService) { }

    /*@Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color
    }

    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color
    }*/


    @Get('/whoami')
    @UseGuards(AuthGuard)
    async whoAmI(@CurrentUser() user: string, @Session() session: any) {

        return session.userId
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id

        return user
    }

    @Post('/signout')
    signout(@Session() session: any) {
        session.userId = null;
    }


    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running')
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }


    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

}


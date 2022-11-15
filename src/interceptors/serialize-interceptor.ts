
import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { plainToInstance } from 'class-transformer'
import { UserDto } from '../users/DTOs/user.dto';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

const jwt = require('jsonwebtoken')


const generateToken = (id, email) => {
    return jwt.sign({
        id,
        email

    }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}



interface ClassConstructor {
    new(...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}


export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) { }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {


        return next.handle().pipe(
            map((data: any) => {

                const transformResult = plainToInstance<{ email: string, id: string, token?: string }, object>(this.dto, data, {
                    excludeExtraneousValues: true,

                })



                if (transformResult instanceof UserDto) {

                    const token = generateToken(data.id, data.email)
                    Object(transformResult).token = token
                }


                return transformResult
            })
        )

    }

}
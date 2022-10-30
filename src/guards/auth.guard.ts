import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { CurrentUser } from '../users/decorators/current-user.decorator';

export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = await context.switchToHttp().getRequest()

        return request.session.userId

    }

}
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { CurrentUser } from '../users/decorators/current-user.decorator';


export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = await context.switchToHttp().getRequest()

        if (!request.currentUser) {
            return false
        }

        return request.currentUser.admin
    }

}
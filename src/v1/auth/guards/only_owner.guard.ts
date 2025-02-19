import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class OnlyOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;
    const userIdFromToken = user.id;
    const userRoleFromToken = user.phanquyen;

    const userIdFromParam = Number(request.params.id);

    if (userIdFromToken === userIdFromParam || userRoleFromToken === '1') {
      return true;
    }

    throw new ForbiddenException('User không có quyền thao tác!');
  }
}

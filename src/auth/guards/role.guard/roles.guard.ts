import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/auth/decorators/role-protected.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@generated';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No se encontró el token');
    }

    if (!roles || roles.length === 0) {
      return true; // si no hay roles, permite el acceso
    }

    const user: Partial<User> = request?.user;

    if (!user) {
      throw new BadRequestException('Usuario no encontrado en la request');
    }

    if (roles.includes(user.role!)) {
      return true;
    }

    try {
      (async () => {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      })();
    } catch {
      throw new UnauthorizedException();
    }

    throw new UnauthorizedException('Usuario no autorizado');
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

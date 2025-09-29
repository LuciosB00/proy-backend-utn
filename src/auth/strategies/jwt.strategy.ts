import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@generated';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      secretOrKey: process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Partial<User>> {
    try {
      const { id } = payload;

      if (!id) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const user = (await this.prismaService.user.findUnique({
        where: {
          id,
          deletedAt: null,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          password: true,
        },
      })) as Partial<User>;

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      return user;
    } catch (error) {
      Logger.error(error);

      if (error?.status === 401) {
        throw new UnauthorizedException('No autorizado');
      }

      throw new InternalServerErrorException();
    }
  }
}

import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = data ? request.user[data] : request.user;

    if (!user) {
      throw new InternalServerErrorException(
        'Usuario no encontrado en la request',
      );
    }

    return user;
  },
);

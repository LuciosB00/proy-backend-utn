import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';
import { HandleErrors } from 'src/common/exceptions/handle-errors';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(order: 'asc' | 'desc' = 'asc') {
    try {
      return await this.prisma.user.findMany({
        where: {
          deletedAt: null,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
        orderBy: {
          fullName: order,
        },
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      if (!email || !password) {
        throw new Error('Email y contraseña son ncesarios')
      }

      if (createUserDto.password.length < 6) {
        throw new Error('Contraseña debe tener al menos 6 caracteres')
      }

      const findUser = await this.prisma.user.findFirst({
        where: {
          email: createUserDto.email,
          deletedAt: null,
        },
      });

      if (findUser) {
        throw new Error('El usuario ya existe')
      }

      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashSync(createUserDto.password, 10),
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        }

      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }
  //verifico si ese email  existe , delete null, que no haya duplicados 
  //actualizar 

  async findOne(id: string) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: id,
          deletedAt: null,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        }
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      let { password, ...rest } = updateUserDto;

      const findUser = await this.findOne(id);

      if (!findUser) {
        throw new Error('Usuario no encontrado');
      }

      if (password?.trim()) {
        password = hashSync(password, 10);
      }

      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...rest,
          password: password || undefined,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        }
      });
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }

  async remove(id: string) {
    try {
      const findUser = this.findOne(id);

      if (!findUser) {
        throw new Error('Usuario no encontrado');
      }
      return await this.prisma.user.update({
        where: {
          id: id,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        }
      })
    } catch (error) {
      HandleErrors.handleHttpExceptions(error);
    }
  }
}

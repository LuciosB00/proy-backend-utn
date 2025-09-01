import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {} 

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
      this.handleError(error);
    }
  }  

  async create(createUserDto: CreateUserDto) {
    try {


      

      const findUser = await this.prisma.user.findUnique({
        where: {
          email: createUserDto.email,
          deletedAt: null,
        },
      });

      if (findUser) {
        throw new ConflictException('El usuario ya existe');
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
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.findOne(id);

      if (!findUser) {
        throw new Error('User not found');
      }

      if (updateUserDto.password) {
        updateUserDto.password = hashSync(updateUserDto.password, 10);
      }

      return await this.prisma.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserDto,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        }
      });
    } catch (error) {
      this.handleError(error);

    }
  }

  handleError(error: any) {
    console.log(error);

    if (error instanceof ConflictException) {
      throw new ConflictException(error.message);
    } else {
      throw new InternalServerErrorException('Error creating user');
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
      this.handleError(error);
    }
  }
}

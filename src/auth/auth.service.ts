import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { User } from "@generated";
import { HandleErrors } from "src/common/exceptions/handle-errors";
import { RegisterDto } from "./dto/register.dto";
import { Role } from "@generated";
import { StudentService } from "src/student/student.service";
import { TeacherService } from "src/teacher/teacher.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { email, password, fullName, role, dni } = registerDto;

      if (!role || role == Role.ADMIN) {
        throw new UnauthorizedException("Rol inválido");
      }

      const exist = await this.prismaService.user.findFirst({
        where: {
          email,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (exist) {
        throw new ConflictException("El usuario ya existe");
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            fullName,
            role,
          },
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        });

        if (role == Role.STUDENT) {
          await this.studentService.create({ userId: user.id, dni }, tx);
        } else if (role == Role.TEACHER) {
          await this.teacherService.create({ userId: user.id, dni }, tx);
        }
      });

      return {
        message: "Usuario registrado exitosamente",
      };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;

      const user = (await this.prismaService.user.findFirst({
        where: {
          email,
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
        throw new UnauthorizedException("Credenciales inválidas");
      }

      if (!bcrypt.compareSync(password, user.password!)) {
        throw new UnauthorizedException("Credenciales inválidas");
      }

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id! }),
      };
    } catch (error) {
      HandleErrors.handleHttpExceptions(error)
    }
  }

  async getStatus(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

      if (user) {
        return {
          id: user.id,
          active: true,
        };
      }

      return {
        id: null,
        active: false,
      };
    } catch (error) {
       HandleErrors.handleHttpExceptions(error)
    }
  }

  private getJwtToken(jwtPayload: JwtPayload) {
    const token = this.jwtService.sign(jwtPayload);
    return token;
  }

  resetPassword() {}

  forgotPassword() {}

  changePassword() {}

  validateUser() {}

  validateToken() {}

  sendEmail() {}
}

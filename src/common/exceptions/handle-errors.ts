import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export class HandleErrors {
  private static readonly logger = new Logger(HandleErrors.name);

  static handleHttpExceptions(error: any): never {
    this.logger.error(`👉 ${HandleErrors.name}: ${error?.message || error}`);
    
    // Manejo para excepciones HTTP de NestJS ya existentes
    if (error instanceof ConflictException) {
      throw error;
    }

    if (error instanceof BadRequestException) {
      throw error;
    }

    if (error instanceof NotFoundException) {
      throw error;
    }

    if (error instanceof UnauthorizedException) {
      throw error;
    }

    throw new InternalServerErrorException('Error interno del servidor');
  }
}
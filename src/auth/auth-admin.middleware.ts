import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthAdminMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) { }
  use(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.headers.authorization || !req.headers.authorization.split(' ')[1]) {
        throw new HttpException('Token não informado', 401);
      }
      const token = req.headers.authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token);
      req.body['user'] = decoded;
      next();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}

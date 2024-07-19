import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthSessionMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService
  ) { }
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.session) {
      throw new HttpException('Token de sessão não informado', 401);
    }
    const sessionToken = req.headers.session as string;
    try {
      const decoded = this.jwtService.verify(sessionToken, { secret: process.env.JWT_SESSION_SECRET });
      req.body['session'] = decoded;
      next();
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}

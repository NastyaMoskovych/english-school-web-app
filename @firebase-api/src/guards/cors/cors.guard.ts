import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ConfigEnum } from '../../shared/models';

@Injectable()
export class CorsGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.method === 'OPTIONS') {
      req.res.status(200).send();
      return false;
    } else if (!this.isOriginAllowed(req) && req.url.includes('api')) {
      req.res.status(403).send('Forbidden');
      return false;
    }

    return true;
  }

  private isOriginAllowed(req: Request): boolean {
    const allowedOrigins = getAllowedOrigins(this.configService);

    return (
      allowedOrigins === '*' || allowedOrigins.includes(req.headers.origin)
    );
  }
}

export const getAllowedOrigins = (
  configService: ConfigService,
): string[] | '*' => {
  return (
    configService.get<string>(ConfigEnum.ALLOWED_ORIGINS)?.split(',') || '*'
  );
};

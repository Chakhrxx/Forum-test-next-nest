// src/auth/apikey.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];

    return this.validateApiKey(apiKey);
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    if (!apiKey) {
      return false;
    }
    return this.authService.validateApiKey(apiKey);
  }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingMessage } from 'http';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    try {
      const message = context.getArgs()[0] as IncomingMessage;
      const url = message.url;
      const secondPathPart = url.split('/')[2];
      if (url.includes('public')) {
        return true;
      }
    } catch (e) {
      console.error('Erro ao tentar pegar URL da rota');
    }
    return super.canActivate(context);
  }
}

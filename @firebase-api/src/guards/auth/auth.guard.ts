import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split('Bearer ')?.[1];
    const { uid } = req.body;

    if (uid && token) {
      try {
        const idToken = await this.firebaseService.auth().verifyIdToken(token);
        return idToken.uid === uid;
      } catch (error) {
        req.res.status(403).send('Forbidden');
        return false;
      }
    }

    return true;
  }
}

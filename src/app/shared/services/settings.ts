import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase';
import { AuthService } from './auth';
import { take, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  collectionName = 'Settings';
  constructor(private firestore: FirebaseService, private auth: AuthService) {}

  async save(data) {
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    console.log('data', data);
    console.log('user', user);
    return this.firestore.set(this.collectionName, user.uid, data).toPromise();
  }
  get(): Observable<any> {
    return this.auth.user$.pipe(
      switchMap((u) =>
        u ? this.firestore.getDocument(this.collectionName, u.uid) : null
      )
    );
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, Observer, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FirebaseService } from './firebase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firebase: FirebaseService, private router: Router) {}

  get user$(): Observable<any> {
    return this.firebase.init$.pipe(
      switchMap(({ firebase, app }) => {
        return Observable.create((obs: Observer<any>) => {
          app.auth().onAuthStateChanged(
            (u) => {
              console.count('onAuthStateChanged');
              if (u) {
                obs.next(u);
              } else {
                obs.next(null);
              }
            },
            (err) => {
              obs.error(err);
            },
            () => {
              obs.complete();
            }
          );
        });
      })
    );
  }

  async googleSignIn() {
    try {
      const { firebase, app } = await this.firebase.init$.toPromise();

      const provider = new (firebase.auth as any).GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'select_account',
      });
      // const provider = new (app.auth() as any).GoogleAuthProvider();
      const credential = await app.auth().signInWithPopup(provider);
      // const credential = await firebase.auth().signInWithPopup(provider);
      console.log(credential);
      //return this.updateUserData(credential.user);
      return credential;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async signOut() {
    const { app } = await this.firebase.init$.toPromise();
    await app.auth().signOut();

    return this.router.navigate(['login']);
  }
}
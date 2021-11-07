import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import * as firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user!: User | null;
  public ready!: boolean;
  public $ready!: Observable<boolean>;

  constructor(private authf: AngularFireAuth, private router: Router, private activatedRouter: ActivatedRoute) {
    //los servicios se invocan desde el constructor
    this.checkSSO();
  }

  /* ------------------- authSample ------------------- */

  public googleLogin(): Promise<firebase.default.auth.UserCredential> {
    return this.authf.signInWithPopup(new GoogleAuthProvider())
  }

  public setUser(u: firebase.default.auth.UserCredential | any | null): void {
    if (u && u.user) {
      this.user = {
        displayName: u.user?.displayName,
        email: u.user?.email,
        photoURL: u.user?.photoURL,
        uid: u.user?.uid
      }
    } else {
      this.user = null;
    }
  }

  public getPhoto(): string {
    return this.user?.photoURL!;
  }

  //public get isLogged(): boolean{} lo transforma en una especie de atributo, la llamada seria auth.service.isLogged.
  // devuelve siempre true, comprobar iniciosesion.
  public get isLogged(): boolean {
    return this.user ? true : false;
  }

  //lo mismo que isLogged pero como manda el tuto
  //da conflicto

  async isAuthenticated() {
    const user = await this.authf.currentUser;
    if (user) {
      this.user = user;
      return true;
    } else {
      return false;
    }
  }


  public checkSSO(): void {
    this.$ready = new Observable((observer) => {
      try {
        this.authf.user.subscribe((data) => {
          this.ready = true;
          if (data != null) {
            this.setUser({ user: data });
            observer.next(true);
          } else {
            this.setUser(null);
            observer.next(false);
          }
          observer.complete();
        })
      } catch (err) {
        this.setUser(null);
        this.ready = true;
        observer.next(false);
        observer.complete();
      }
    }
    )
  }

  public logout(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.isLogged) {
        try {
          await this.authf.signOut();
          this.setUser(null);
          resolve();
        } catch (error) {
          reject(error);
        }
      }
    })
  }

  /*logout(): Promise<void> {
    return firebase.default.auth().signOut();
  }*/

  /* ------------------- authSample ------------------- */

  registroUsuario(userdata: any) {
    firebase.default.auth().createUserWithEmailAndPassword(userdata.email,
      userdata.password)
      .catch(
        (error: any) => {
        }
      )
  }

  inicioSesion(userdata: any) {
    firebase.default.auth().signInWithEmailAndPassword(userdata.email,
      userdata.password)
      .then(response => {
        this.router.navigate(['/inicio']);
      })
      .catch(
        error => {
        }
      )
  }

  public doTwitterLogin(): Promise<firebase.default.auth.UserCredential> {
    return this.authf.signInWithPopup(new TwitterAuthProvider());
  }

}

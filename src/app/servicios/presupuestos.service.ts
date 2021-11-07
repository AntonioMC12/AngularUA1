import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { throwError } from 'rxjs';
import { Presupuesto } from '../model/Presupuesto';


@Injectable({
  providedIn: 'root'
})
export class PresupuestosService {

  constructor(private db: AngularFireDatabase) { }

  postPresupuesto(presupuesto: any): void {
    this.db.database.ref().child("presupuesto").push(presupuesto);
  }

  /*getPresupuestos(): any[] {
    let result: Presupuesto[] = [];
    this.db.database.ref().child("presupuesto").get().then((data) => {
      const presupuestos = data.val();
      for (let presupuesto in presupuestos) {
        result.push({ key: presupuesto, ...presupuestos[presupuesto] });
      }
    });
    return result;
  }*/

  async getPresupuestos() {
    try {
      let result: Presupuesto[] = [];
      let tmp = await this.db.database.ref().child("presupuesto").get();
      for (let presupuesto in tmp.val()) {
        result.push({ key: presupuesto, ...tmp.val()[presupuesto] });
      }
      return result;
    } catch (error: any) {
      throwError(error);
      return null;
    }
  }

  async getPresupuesto(key: string) {
    try {
      let tmp = await this.db.database.ref().child("presupuesto").child(key).get();
      let result: Presupuesto = tmp.val();
      return result;

    } catch (err) {
      throwError(err);
      return null;
    }
    //return this.db.object("presupuesto/"+key);
  }

  /**
  getPresupuesto(key:string):Promise<firebase.default.database.DataSnapshot>{
    return this.db.database.ref().child("presupuesto").child(key).get()   
  }
   */

  putPresupuesto(presupuesto: any, key: string) {
    this.db.database.ref().child("presupuesto").child(key).update(presupuesto);
  }

  delPresupuesto(key: string) {
    this.db.object('presupuesto/' + key).remove();
  }
}

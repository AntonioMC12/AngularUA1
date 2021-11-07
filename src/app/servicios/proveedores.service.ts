import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { throwError } from 'rxjs';
import { Proveedor } from '../model/Proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(private db: AngularFireDatabase) { }


  async getProveedores() {
    try {
      let result: Proveedor[] = [];
      let tmp = await this.db.database.ref().child("proveedor").get();

      for (let proveedor in tmp.val()) {
        result.push({ key: proveedor, ...tmp.val()[proveedor] });
      }

      return result;
    } catch (error) {
      throwError(error);
      return null;
    }

  }

  postProveedor(proveedor: any): void {
    this.db.database.ref().child("proveedor").push(proveedor);
  }

  putProveedor(proveedor: any, key: string) {
    this.db.database.ref().child("proveedor").child(key).update(proveedor);
  }

  delProveedor(key: string) {
    this.db.object('proveedor/' + key).remove();
  }

  async getProveedor(key: string) {
    try {
      let tmp = await this.db.database.ref().child("proveedor").child(key).get();
      let result: Proveedor = tmp.val();
      return result;

    } catch (error) {
      throwError(error);
      return null;
    }
  }
}

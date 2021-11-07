import { Component, OnInit } from '@angular/core';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  public proveedores!:any[]|null;
  ready: boolean = false;

  constructor(private ps:ProveedoresService) {
    (async ()=>{
      this.proveedores =await this.ps.getProveedores();
      this.ready=true;
    })();
   }

  ngOnInit(): void {
  }

  eliminarProveedor(key:any){
    this.ps.delProveedor(key);
    this.ready = false;
    (async ()=>{
      this.proveedores =await this.ps.getProveedores();
      this.ready=true;
    })();
  }
}

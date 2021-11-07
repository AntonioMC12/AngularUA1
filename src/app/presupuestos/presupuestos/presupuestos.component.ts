import { Component, OnInit } from '@angular/core';
import { PresupuestosService } from 'src/app/servicios/presupuestos.service';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.css']
})
export class PresupuestosComponent implements OnInit {

  presupuestos!: any[]|null;
  ready:boolean = false;

  constructor(private presupuestosService: PresupuestosService) {
    (async ()=>{
       this.presupuestos =await this.presupuestosService.getPresupuestos();
       this.ready=true;
     })();
  }

  ngOnInit(): void {
  }

  eliminarPresupuesto(key: string) {
    this.presupuestosService.delPresupuesto(key);
    this.ready = false;
    (async ()=>{
      this.presupuestos =await this.presupuestosService.getPresupuestos();
      this.ready=true;
    })();
  }

}

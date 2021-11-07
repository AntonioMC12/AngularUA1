import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ChangeDetectorRef } from '@angular/core'; //para detectar cambios, mas abajo explicado.
import { PresupuestosService } from 'src/app/servicios/presupuestos.service';

@Component({
  selector: 'app-addpres',
  templateUrl: './addpres.component.html',
  styleUrls: ['./addpres.component.css']
})
export class AddpresComponent implements OnInit {

  presupuestoForm!: FormGroup;
  presupuesto: any;
  base: any;
  tipo: any;
  iva: any = 0;
  total: any = 0;

  constructor(private pf: FormBuilder, private cdref: ChangeDetectorRef, private presupuestoService:PresupuestosService) { }

  ngOnInit(): void {
    this.presupuestoForm = this.pf.group({
      proveedor: ['', [Validators.required,Validators.minLength(4)]],
      fecha: ['', Validators.required],
      concepto: ['', [Validators.required, Validators.minLength(10)]],
      base: ['', [Validators.required,Validators.min(0)]],
      tipo: ['', Validators.required],
      iva: [{value:this.iva, disabled: true}],
      total: [{value:this.total, disabled: true}]
    });
    this.onChanges();
    
    //para que Angular detecte los cambios en las variables y no de error NG0100: ExpressionChangedAfterItHasBeenCheckedError
    this.cdref.detectChanges();
  }

  onChanges(): void {
    this.presupuestoForm.valueChanges.subscribe(valor => {
      this.base = valor.base;
      this.tipo = valor.tipo;
      this.presupuestoForm.value.iva = this.base * this.tipo/100;
      this.presupuestoForm.value.total = this.base + (this.base * this.tipo/100);
      // this.presupuestoForm.get('iva')!.setValue(this.base*this.tipo);
      // this.presupuestoForm.get('total')!.setValue(this.base + (this.base * this.tipo));
      // this.presupuestoForm.setValue({iva: (this.base * this.tipo), total:(this.base + (this.base * this.tipo))});
    });
  }

  onSubmit() {
    this.presupuesto = this.savePresupuesto();
    this.presupuestoService.postPresupuesto(this.presupuesto);
    this.presupuestoForm.reset();
  }

  savePresupuesto() {
    const savePresupuesto = {
      proveedor: this.presupuestoForm.get('proveedor')!.value,
      fecha: this.presupuestoForm.get('fecha')!.value,
      concepto: this.presupuestoForm.get('concepto')!.value,
      base: this.presupuestoForm.get('base')!.value,
      tipo: this.presupuestoForm.get('tipo')!.value,
      iva: this.presupuestoForm.get('iva')!.value,
      total: this.presupuestoForm.get('total')!.value
    };
    return savePresupuesto;
  }
}

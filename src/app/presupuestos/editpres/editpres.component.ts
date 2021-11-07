import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Presupuesto } from 'src/app/model/Presupuesto';
import { PresupuestosService } from 'src/app/servicios/presupuestos.service';

@Component({
  selector: 'app-editpres',
  templateUrl: './editpres.component.html',
  styleUrls: ['./editpres.component.css']
})
export class EditpresComponent implements OnInit {

  presupuestoForm!: FormGroup;
  presupuesto?: Presupuesto|any;
  ready:boolean = false;
  base: any = '';
  tipo: any = '';
  iva: any = 0;
  total: any = 0;
  key: string = '';

  constructor(private pf: FormBuilder, private presupuestoService: PresupuestosService, private router: Router, private activatedRouter: ActivatedRoute,private cdref: ChangeDetectorRef) {
    this.activatedRouter.params.subscribe(parametros => {
      this.key = parametros['key'];      
      (async ()=>{
       /* try{
          let result= await this.presupuestoService.getPresupuesto(this.key);
            this.presupuesto=result.val();
            console.log(this.presupuesto)
        }catch(err){
        }*/
        this.presupuesto=await this.presupuestoService.getPresupuesto(this.key);
        this.presupuesto.$key=this.key;
        this.setPresupuesto();
        this.ready=true;
      })();
      
    });
  }

  ngOnInit(): void {
    this.setPresupuesto();
    /**
     * loading
     * seteo
     * oculta loading
     * 
     * lo hago en el constructor.
     */
    
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
    this.presupuestoService.putPresupuesto(this.presupuesto,this.key);
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

  updatePresupuesto(){
    this.presupuesto = this.savePresupuesto();
    this.presupuestoService.putPresupuesto(this.presupuesto,this.key);
    this.router.navigate(['/presupuestos']);
  }

  setPresupuesto(){
    this.presupuestoForm = this.pf.group({
      proveedor: [this.presupuesto?.proveedor, [Validators.required,Validators.minLength(4)]],
      fecha: [this.presupuesto?.fecha, Validators.required],
      concepto: [this.presupuesto?.concepto, [Validators.required, Validators.minLength(10)]],
      base: [this.presupuesto?.base, [Validators.required,Validators.min(0)]],
      tipo: [this.presupuesto?.tipo, Validators.required],
      iva: [{value:this.iva, disabled: true}],
      total: [{value:this.total, disabled: true}]
    });
    this.onChanges();
    
    //para que Angular detecte los cambios en las variables y no de error NG0100: ExpressionChangedAfterItHasBeenCheckedError
    this.cdref.detectChanges();
  }
}

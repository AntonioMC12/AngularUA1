import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/model/Proveedor';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';

@Component({
  selector: 'app-editprove',
  templateUrl: './editprove.component.html',
  styleUrls: ['./editprove.component.css']
})
export class EditproveComponent implements OnInit {

  proveedorForm!: FormGroup;
  proveedor?: Proveedor | any;
  ready: boolean = false;
  key: string = '';

  constructor(private pf: FormBuilder, private proveedorService: ProveedoresService, private router: Router, private activatedRouter: ActivatedRoute, private cdref: ChangeDetectorRef) {
    this.activatedRouter.params.subscribe(parametros => {
      this.key = parametros['key'];
      (async () => {
        this.proveedor = await this.proveedorService.getProveedor(this.key);
        this.proveedor.key = this.key;
        this.setProveedor();
        this.ready = true;
      })();
    })
  }

  ngOnInit(): void {
    this.setProveedor();
  }

  saveProveedor() {
    const saveProveedor = {
      nombre: this.proveedorForm.get('nombre')!.value,
      cif: this.proveedorForm.get('cif')!.value,
      direccion: this.proveedorForm.get('direccion')!.value,
      cp: this.proveedorForm.get('cp')!.value,
      localidad: this.proveedorForm.get('localidad')!.value,
      provincia: this.proveedorForm.get('provincia')!.value,
      telefono: this.proveedorForm.get('telefono')!.value,
      email: this.proveedorForm.get('email')!.value,
      contacto: this.proveedorForm.get('contacto')!.value
    };
    return saveProveedor;
  }

  setProveedor() {
    this.proveedorForm = this.pf.group({
      nombre: [this.proveedor?.nombre, [Validators.required, Validators.minLength(3)]],
      cif: [this.proveedor?.cif, [Validators.required, Validators.minLength(9), Validators.pattern('^([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])$')]],
      direccion: [this.proveedor?.direccion, [Validators.required, Validators.minLength(4)]],
      cp: [this.proveedor?.cp, [Validators.required, Validators.minLength(5)]],
      localidad: [this.proveedor?.localidad, [Validators.required, Validators.minLength(4)]],
      provincia: [this.proveedor?.provincia, [Validators.required]],
      telefono: [this.proveedor?.telefono, [Validators.required, Validators.minLength(9), Validators.pattern('^[679]{1}[0-9]{8}$')]],
      email: [this.proveedor?.email, [Validators.required, Validators.email]],
      contacto: [this.proveedor?.contacto, [Validators.required, Validators.minLength(4)]]
    });
    this.cdref.detectChanges();
  }

  updateProveedor(){
    this.proveedor = this.saveProveedor();
    this.proveedorService.putProveedor(this.proveedor,this.key);
    this.router.navigate(['/proveedores']);
  }

}

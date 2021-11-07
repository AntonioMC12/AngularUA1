import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProveedoresService } from 'src/app/servicios/proveedores.service';

@Component({
  selector: 'app-addprovee',
  templateUrl: './addprovee.component.html',
  styleUrls: ['./addprovee.component.css']
})
export class AddproveeComponent implements OnInit {

  proveedorForm!: FormGroup;
  proveedor: any;

  constructor(private proveedorService: ProveedoresService, private pf: FormBuilder, private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.proveedorForm = this.pf.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      cif: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^([a-z]|[A-Z]|[0-9])[0-9]{7}([a-z]|[A-Z]|[0-9])$')]],
      direccion: ['', [Validators.required, Validators.minLength(4)]],
      cp: ['', [Validators.required, Validators.minLength(5)]],
      localidad: ['', [Validators.required, Validators.minLength(4)]],
      provincia: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.pattern('^[679]{1}[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      contacto: ['', [Validators.required, Validators.minLength(4)]]
    });
    this.cdref.detectChanges();
  }

  onSubmit() {
    this.proveedor = this.saveProveedor();
    this.proveedorService.postProveedor(this.proveedor);
    this.proveedorForm.reset();
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
}

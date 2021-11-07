import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-inises',
  templateUrl: './inises.component.html',
  styleUrls: ['./inises.component.css']
})
export class InisesComponent implements OnInit {

  loginForm!: FormGroup;
  userdata: any;
  mensaje = false;

  constructor(private formBuilder: FormBuilder, private autService: AuthService, private router: Router, private activatedRouter: ActivatedRoute) { }


  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)
      ]
      ]
    });
  }

  onSubmit() {
    this.userdata = this.saveUserdata();
    this.autService.inicioSesion(this.userdata);
    setTimeout(async () => {
      if (await this.isAuth() === false) {
        this.mensaje = true
      }
    }, 2000);
  }

  saveUserdata() {
    const saveUserdata = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    return saveUserdata;
  }

  loginGoogle() {
    this.autService.googleLogin()
      .then((data) => {
        this.autService.setUser(data);
        if (this.autService.isLogged) {
          this.router.navigate(['/inicio']);
        }
      })
      .catch(err => {

      })
  }

  async isAuth() {

    await this.autService.isAuthenticated();
    return this.autService.isLogged;
  }

  loginTwitter() {
    this.autService.doTwitterLogin()
      .then((data) => {
        this.autService.setUser(data);
        if (this.autService.isLogged) {
          this.router.navigate(['/inicio']);
        }
      })
      .catch(err => {

      })
  }

}

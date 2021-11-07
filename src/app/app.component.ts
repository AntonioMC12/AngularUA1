import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularUA1';

  constructor(public authS:AuthService,private router:Router){}

  ngOnInit() {
    this.authS.$ready.subscribe((data) => {
      if (data) {
        this.router.navigate(['/inicio']);
      }
    })
  }
}

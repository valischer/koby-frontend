/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth} from 'angularfire2/auth';


@Component({
  selector: 'nb-login',
  templateUrl: './login.component.html'
  ,
})
export class NbLoginComponent {



  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  emailText:any;
  passwordText:any;

  constructor(protected router: Router, protected afAuth:AngularFireAuth) {

  }

  login(): void {
    this.afAuth.auth.signInWithEmailAndPassword(this.emailText, this.passwordText)
    .then((user)=>{this.router.navigate(['/pages/dashboard'])})

  }


}

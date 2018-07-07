import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore'

@Component({
  selector: 'ngx-create-user',
  styleUrls: ['./create-user.component.scss'],
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit, OnDestroy {
  institution_name:any;
  institution_id:any;
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  userId:any;
  user:any;
  userReady: any = false;
  constructor(
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
            private afAuth:AngularFireAuth,
            private afs: AngularFirestore, private http: HttpClient) {
    //THEME RELATED
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.afAuth.user.subscribe(data => {
      console.log(data.uid)
      this.userId = data.uid
      this.user = this.afs.collection('users').doc(this.userId).valueChanges()
      this.userReady=true;
    })

  }

  ngOnInit() {

  }
  createInstitution(){
    this.http.get(encodeURI('http://35.237.86.151:5000/create_bank?id='+this.institution_id+'&name='+this.institution_name)).subscribe(data => console.log(data))
  }
  createClient(){
    this.http.get(encodeURI('http://35.237.86.151:5000/create_client?id='+this.institution_id+'&name='+this.institution_name)).subscribe(data => console.log(data))
  }
  createVerifier(){
    this.http.get(encodeURI('http://35.237.86.151:5000/create_verifier?id='+this.institution_id+'&name='+this.institution_name)).subscribe(data => console.log(data))
  }
//save file from device camera in browser memory, save URL to be used locally

  //Destroying theme subscription
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}

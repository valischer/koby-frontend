import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import {AngularFirestore} from 'angularfire2/firestore'
import {AngularFireAuth} from 'angularfire2/auth'
import { AngularFireStorage } from 'angularfire2/storage'
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'ngx-verifier',
  styleUrls: ['./verifier.component.scss'],
  templateUrl: './verifier.component.html',
})
export class VerifierComponent implements OnInit, OnDestroy {
  url: any
  selectedFile = null;
  base64textString: string;
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  userId:any;
  passport:any;
  isBlockchain:any;
  verificationStatus:any;
  passports:any =[];
  client:any;
  passportsData:any;
  dataArray:Array<any>=[];
  docs:any;
  constructor(
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService, private afs:AngularFirestore, private afAuth: AngularFireAuth, private storage:AngularFireStorage, private http:HttpClient) {
    //THEME RELATED
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.docs = this.http.get('http://35.185.117.182:5000/get_alldocs')
    this.afAuth.user.subscribe(data =>{
      this.userId = data.uid;
    })

  }

  ngOnInit() {

  }

verify(doc){
  this.http.get('http://35.185.117.182:5000/verificationComplete?verID='+this.userId+'&docID='+doc+'&status=Authentic').subscribe(data =>{console.log(data)})

}





  //Destroying theme subscription
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }


}

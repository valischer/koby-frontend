import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import {AngularFirestore} from 'angularfire2/firestore'
import {AngularFireAuth} from 'angularfire2/auth'
import { AngularFireStorage } from 'angularfire2/storage'
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'ngx-bank-verifier',
  styleUrls: ['./bank-verifier.component.scss'],
  templateUrl: './bank-verifier.component.html',
})
export class BankVerifierComponent implements OnInit, OnDestroy {
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
  constructor(
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService, private afs:AngularFirestore, private afAuth: AngularFireAuth, private storage:AngularFireStorage, private http:HttpClient) {
    //THEME RELATED
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.userId = this.afAuth.user.subscribe(data =>{
      this.userId = data.uid
      this.passport = this.afs.collection('passport', ref => ref.where('bank','==',this.userId).where('sent_to_bc','==',false)).snapshotChanges().map(changes =>{
         return changes.map(a => {
           const data = a.payload.doc.data();
           const id = a.payload.doc.id
           return {id: id, ...data}

         })
       })
      this.passport.subscribe(data =>{
        this.passportsData=data;
        console.log(this.passportsData)
        data.forEach(data => {
          if(data.sent_to_bc == false){
            this.client=this.afs.collection('users').doc(data.client).valueChanges()
            const ref = this.storage.ref(data.path)
            var url = ref.getDownloadURL();
            this.passports.push(url)
          }
        })
      })
    })
  }

  ngOnInit() {

  }


  uploadImage(){
  this.passports[0].subscribe(data =>{
    this.http.get('http://35.185.117.182:5000/create_doc?&docID='+this.passportsData[0].id+'&docs='+data+'&clientID='+this.passportsData[0].client+'&bankID='+this.userId).subscribe(data=>console.log(data))
  })


  }

  //Destroying theme subscription
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }


}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import {AngularFirestore} from 'angularfire2/firestore'
import {AngularFireAuth} from 'angularfire2/auth'
import { AngularFireStorage } from 'angularfire2/storage'

@Component({
  selector: 'ngx-institutions',
  styleUrls: ['./institutions.component.scss'],
  templateUrl: './institutions.component.html',
})
export class InstitutionsComponent implements OnInit, OnDestroy {

  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;
  institutions: any =[];
  institution:any;
  userId: any;
  passport:any;
  doc:any;
  constructor(
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService, private http:HttpClient, private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    //THEME RELATED
    this.breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeSubscription = this.themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    this.afAuth.user.subscribe(data =>{
      this.userId = data.uid;
      console.log(this.userId)
      this.afs.collection('passport', ref => ref.where('client','==',this.userId)).snapshotChanges().map(changes =>{
         return changes.map(a => {
           const data = a.payload.doc.data();
           const id = a.payload.doc.id
           return {id: id, ...data}
         })
       }).subscribe(data => {
         this.passport = data[0].id;
         this.http.get('http://35.237.86.151:5000/get_doc?&id='+this.passport).subscribe(data =>console.log(data))
       });
      this.http.get('http://35.237.86.151:5000/get_allbanks').subscribe(data => {
          this.institutions = data;
          console.log(data)
    })

  })
  }

  ngOnInit() {

  }
  addToWhitelist(){
this.http.get('http://35.237.86.151:5000/clientALlowBank?docID='+this.passport+'&bankID='+this.institution).subscribe(data =>console.log(data))
  }
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}

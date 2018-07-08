import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import {AngularFirestore} from 'angularfire2/firestore'
import {AngularFireAuth} from 'angularfire2/auth'
import { AngularFireStorage } from 'angularfire2/storage'
import { HttpClient } from '@angular/common/http'


@Component({
  selector: 'ngx-passport',
  styleUrls: ['./passport.component.scss'],
  templateUrl: './passport.component.html',
})
export class PassportComponent implements OnInit, OnDestroy {
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
      this.passport = this.afs.collection('passport', ref => ref.where('client','==',this.userId)).snapshotChanges().map(changes =>{
         return changes.map(a => {
           const data = a.payload.doc.data();
           const id = a.payload.doc.id
           return {id: id, ...data}

         })
       })
      this.passport.subscribe(data =>{
        this.http.get(encodeURI('http://35.185.117.182:5000/get_doc?id='+data[0].id)).subscribe(data => {
          console.log(data)
          if(data.hasOwnProperty('error')){
            this.isBlockchain=false;
          }
          else {
            this.verificationStatus = data['verificationStatus'];
          }
        })
      })
    })
  }

  ngOnInit() {

  }
//save file from device camera in browser memory, save URL to be used locally
  onFileSelected(event)
  {
    this.selectedFile = event.target.files[0];
    var reader = new FileReader();

    reader.onload = (event:any) => {
      this.url = event.target.result;
    }

    reader.readAsDataURL(event.target.files[0])
  }
//no upload - process image and send to callback for processing and sending to backend
  uploadImage(){
  const file = this.selectedFile;
  const filePath = this.userId;
  const ref = this.storage.ref(filePath);
  const task = ref.put(file);
  const id = this.afs.createId();
  this.afs.collection('passport').doc(id).set({
    id:id,
    path: filePath,
    client:this.userId,
    sent_to_bc:false,
    bank:'APDsUdiUi4h6V6ec84PZ0jMbDdG3'
  })


    // var reader = new FileReader();
    //
    //     reader.onload =this._handleReaderLoaded.bind(this);
    //
    //     reader.readAsBinaryString(this.selectedFile);

  }
//convert to binary and send to back-end to be processed by Financial Institution --save on BC ? or not
_handleReaderLoaded(readerEvt){
  var binaryString = readerEvt.target.result;
            this.base64textString= btoa(binaryString);
            var id = this.afs.createId();
            this.afs.collection('passports').doc(id).set(
              {
                base64pic:this.base64textString,
                client:this.userId,
                id: id
              }
            ).then((data) => alert('success')).catch((error) => alert(error));//send to back-end API for processing here
  }
  //Destroying theme subscription
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }


}

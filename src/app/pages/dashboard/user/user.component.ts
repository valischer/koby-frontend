import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService, NbMediaBreakpoint, NbMediaBreakpointsService } from '@nebular/theme';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore'

@Component({
  selector: 'ngx-user',
  styleUrls: ['./user.component.scss'],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit, OnDestroy {
  url: any
  selectedFile = null;
  base64textString: string;
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
            private afs: AngularFirestore) {
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
    var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(this.selectedFile);

  }
//convert to binary and send to back-end to be processed by Financial Institution --save on BC ? or not
_handleReaderLoaded(readerEvt){
  var binaryString = readerEvt.target.result;
            this.base64textString= btoa(binaryString);
            console.log(btoa(binaryString));//send to back-end API for processing here
  }
  //Destroying theme subscription
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}

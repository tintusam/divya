import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-po-dashboard',
  templateUrl: './po-dashboard.component.html',
  styleUrls: ['./po-dashboard.component.css']
})
export class PoDashboardComponent implements OnInit {

  public showUploadForm:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }


  toggleUploadForm(){
    this.showUploadForm = !this.showUploadForm;
    console.log(this.showUploadForm);
  }
  
}

import { Component, OnInit } from '@angular/core';
import { AppService } from '../../Service/app.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-view-qr-code',
  templateUrl: './view-qr-code.component.html',
  styleUrls: ['./view-qr-code.component.scss']
})
export class ViewQRCodeComponent implements OnInit {
  EmployeeId = '';
  Location = '';
  Status = ''
  showQRCode = false;
  showErrorMsg = false;
  showLoader = true;
  responseObj: any;
  constructor(private app: AppService, private router: Router) {
    this.EmployeeId = sessionStorage.getItem('EmployeeId');
    // this.Location = sessionStorage.getItem('storeId');
  }

  ngOnInit() {
    // this.EmployeeId = sessionStorage.getItem('EmployeeId')

    //   https://co-track-wfo-function.azurewebsites.net/api/GetEmpQrCodeValidity
    let payload = {
      "EmployeeId": this.EmployeeId,
      // "Location": this.Location
    }

    this.app.validateEmployeeId(payload).subscribe(res => {
      this.responseObj = res;
      if (this.responseObj.Message === 'EmployeeId Found') {
        this.showLoader = false;
        this.showQRCode = true;
        this.showErrorMsg = false;
        sessionStorage.setItem("EmployeeKey", this.responseObj.EmployeeKey)
      } else {
        this.showLoader = false;
        this.showErrorMsg = true;

        this.showQRCode = false
      }

    })

  }

  gotoSelfDeclare() {
    this.router.navigate(['action-center/generate-QR-code'])
  }

}

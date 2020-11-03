import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
const ApiUrl = "https://co-track-wfo-function.azurewebsites.net/api/";
const newApiUrl = "https://self-declaration-function-app.azurewebsites.net/api/";
const bestbuyUrl="https://bestbuyapi.azurewebsites.net/api/";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  GetAllLocation() {
    return this.http.get(ApiUrl + 'GetAllLocation')
  }

  getAllSites() {
    return this.http.get(bestbuyUrl + 'GetAllStores')
  }

  postQuestionaireResponse(Payload) {
    return this.http.post(newApiUrl + 'selfDeclaration', Payload);
  }

  getQRCodeValidity(Payload) {
    return this.http.post(ApiUrl + 'GetEmpQrCodeValidity', Payload);
  }

  verifyUniqueCode(payload){
    return this.http.post(bestbuyUrl + 'VerifyUniqueCode',payload)
  }

  visitorLog(payload){
    return this.http.post(bestbuyUrl + 'CreateVisitorLog',payload)
  }
  
  
}

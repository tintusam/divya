import { Component, OnInit } from '@angular/core';
import { AppService } from '../../Services/app.service';

@Component({
  selector: 'app-tnt-dashboard',
  templateUrl: './tnt-dashboard.component.html',
  styleUrls: ['./tnt-dashboard.component.scss']
})
export class TNTDashboardComponent implements OnInit {

  public siteList:any;
  public selectedSiteID:any;
  public data;

  constructor(private _appService:AppService) { }

  ngOnInit() {
    this.getAllSites();
    this.data = { max: 5, data: [{ x: 10, y: 15, value: 5}, { x: 5, y: 20, value: 4}] }
  }

  selectedSite(siteInfo){
    this.selectedSiteID = siteInfo.target.value;
  }

  getAllSites(){
    this._appService.GetAllStore().subscribe(
      res => {
        this.siteList = res;
        console.log(this.siteList);
      },
      err => {
        console.log(err);
      }
    )
  }

}

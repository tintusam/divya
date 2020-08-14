/// <reference path="../../../../node_modules/bingmaps/types/MicrosoftMaps/Microsoft.Maps.All.d.ts" />

import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from './../../services/dashboard.service';
import { AssetsService } from './../../services/assets.service';
import { MapService } from './../../services/map.service';
import * as CanvasJS from './../../../assets/js/canvasjs.min';
import { DatePipe } from '@angular/common'
declare var $:any;

@Component({
  selector: 'app-smart-view',
  templateUrl: './smart-view.component.html',
  styleUrls: ['./smart-view.component.css']
})

export class SmartViewComponent implements OnInit, OnDestroy {

  public assetsList: any;
  public particularAssetData: any;
  public originalAssetsList: any;
  public parameterMsg:String;
  public myassetType: string;
  public myassetStatus: string;
  public recentData: any;
  public recentInsightData: any;
  public recentAssetData: any;
  public recentParametersData: any;
  public recentAlertsData: any;
  public listAssetsByType: any;
  public listAssetsByStatus: any;
  public assetCount: number;
  public alertUtilCount: number;
  public alertassetCount: number;
  public redalert: number;
  public amberalert: number;
  public greenalert: number;
  public IdleAssetCount: number;
  public pollID: any;
  public autoPollID:any;
  public isRed: boolean;
  public markerIcon: string;
  public isGreen: boolean;
  public amberAlerts: any[];
  public redAlerts: any[];
  public greenAlerts: any[];
  public isAlertsDataLoaded: boolean = false;
  public hideSidebar: boolean = true;
  public hideRedAlerts: boolean = true;
  public hideAmberAlerts: boolean = true;
  public hideGreenAlerts: boolean = true;
  public showAssetTypesList: boolean = false;
  public showAssetStatusList: boolean = false;
  public amberAlertsCount: number;
  public movableAssetsCount: number;
  public redAlertsCount: number;
  public greenAlertsCount: number;
  public alertColor: string;
  public ramAssetType: string;
  public status: any;
  public sensorParameters: Array<any> = [];
  public mapLoaded: boolean = false;
  public AssetTypeCount: number;
  public MovableCount: number;
  public NonMovableCount: number;
  public AssetUtilCount: number;
  public assetWidgetLoader: boolean = false;
  public lat: number = 55.183028;
  public lng: number = -2.450000;
  public assetid;
  public assetname;
  public assetsensor;
  public gdata = [1, 2, 3, 4, 5, 56, 7, 12, 4, 52];
  public chartData = [];
  public rawchartData = [];
  public rawParamData = [];
  public paramData: any[];
  //BING MAPS
  public currLat = 0.0;
  public currLng = 0.0;
  public mapPin: any;
  public pin: any[] = [];
  public pinInfobox: any[] = [];
  public showInfo = false;
  private map: Microsoft.Maps.Map;
  loadAPI: Promise<any>;
  public dateRange: string = "oneday";
  public parameterName: string;
  public view = true;
  public savedFrequency = false;
  public frequencyMessage: string;
  public frequencyMsg: boolean = false;
  public frequencyLoader: boolean = false;
  public alertParameterName: String;
  public showParamLoader: boolean;
  public isGraphLoading:boolean = true;

  public SumLat;
  public sumLong;
  public _markers: any[];
  public avgNumericLat;
  public avgNumericLong;
  public _options: any;
  public _box: any;
  public _iconInfo: any;

  @ViewChild('myMap', { static: false }) myMap;

  selectedParam;
  eventHandler;
  event;
  centerMarker;
  assetcontact: any;
  renderFrequency: number;
  dataPollFrequency: number = 10000; // setting default polling time for sensor api trigger as 1 min

  constructor(private dashboardService: DashboardService, private assetsService: AssetsService, public _dataService: MapService, private el: ElementRef, public datePipe:DatePipe) { }

  ngOnInit() {
    // this.showRecentAssetDetails();
    this.showAlertsCount();
    this.getAssetsList();
    // to refresh the alerts count in every 10 seconds as the part of backend change made for showing sleep assets.
    this.autoPollID = setInterval(() => {
      this.showAlertsCount();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.autoPollID) {
      clearInterval(this.autoPollID);
    }
  }

  // clear the API Triggering when Modal is closed. This is to avoid unwanted memory leakage.
  clearTriggers() {
    this.frequencyMsg = false;
    if (this.pollID) {
      clearInterval(this.pollID);
    }
  }

  saveFrequency(frequency) {
    let payload: any = {
      Asset_ID: this.assetid,
      "Frequency": frequency
    };
    this.frequencyLoader = true;
    this.dashboardService.getAssetRenderFrequency(payload)
      .subscribe(
        (res) => {
          var renderResponse = JSON.parse(res["_body"]);
          this.frequencyMessage = renderResponse;
          this.savedFrequency = true;
          this.frequencyMsg = true;
          this.frequencyLoader = false;
          this.view = true;
          this.getAssetsList();
          this.dataPollFrequency = frequency * 60000;
          //console.log(frequency);  
          setTimeout(this.clearTriggers, 3000);
        }, (error) => {
          if (error.status === 400) {
            this.frequencyMessage = "Network Error Occured! Please try again.";
            this.frequencyMsg = true;
            this.frequencyLoader = false;
            setTimeout(this.clearTriggers, 3000);
          }
        });
  }



  editFrequency() {
    this.savedFrequency = false;
    this.view = false;
    this.frequencyMsg = false;
    this.frequencyLoader = false;
  }

  mapOnInit() {
    this._dataService.load().then(() => {
      this.map = new Microsoft.Maps.Map(this.myMap.nativeElement, {
        credentials: 'Avh43rwIxMpHSkLOHeo7MeaFNwaQgk8BsehjzGxYxscXNvi6VH_VlUnX_MHAyFzw',
        center: new Microsoft.Maps.Location(this.lat, this.lng),
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        zoom: 4
      });
      this.mapLoaded = true;
      var center = this.map.getCenter();
      //console.log(this.assetsList);
      for (let m of this.assetsList) {
        if (Number(m.RAM_Latitude) != 0.0) {
          //console.log("longitudes:" + m.RAM_Longitude);
          if (m.RAM_Status == "Red") {
            this.markerIcon = '../assets/place_red.svg';
          }
          else {
            this.markerIcon = '../assets/place-24px.svg';
          }
          this.pin.push(new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(Number(m.RAM_Latitude), Number(m.RAM_Longitude)), {
            icon: this.markerIcon,
          }));
          this.pinInfobox.push(new Microsoft.Maps.Infobox(
            new Microsoft.Maps.Location(Number(m.RAM_Latitude), Number(m.RAM_Longitude)),
            { title: m.RAM_AssetID, visible: true }
          ));
        }
      }

      this.map.entities.push(this.pin);
      for (let i = 0; i < this.pin.length; i++) {
        Microsoft.Maps.Events.addHandler(this.pin[i], 'mouseover', e => {
          this.pinInfobox[i].setMap(this.map);
        });
        Microsoft.Maps.Events.addHandler(this.pin[i], 'mouseout', e => {
          this.pinInfobox[i].setMap();
        });
        Microsoft.Maps.Events.addHandler(this.pin[i], 'click', e => {
          this.setDefaultTab();
          this.assetid = this.pinInfobox[i].getTitle();
          this.recentData = [];
          this.recentAlertsData = [];
          this.assetsensor = this.assetsList[i].RAM_SensorkitID;
          let params: any = {
            RAM_SensorID: this.assetsensor
          }
          this.assetsService.getSensorKitParams(params)
            .subscribe(res => {
              this.sensorParameters = res;
              this.showInfo = true;
            });
          this.assetname = this.assetsList[i].RAM_location;
          this.assetcontact = this.assetsList[i].RAM_Asset_Contact
          this.showRecentAssetDetails();
          this.showInsightParameters();
          this.showRAMVoltAlert();
          this.status = this.assetsList[i].RAM_Status;
          this.renderFrequency = this.assetsList[i].Frequency;
          this.dataPollFrequency = this.renderFrequency * 60000;

          // Triggering Sensor Data Dispaying API based on Frequency Set on UI
          this.pollID = setInterval(() => {
            this.showRecentAssetDetails();
            this.showInsightParameters();
            this.showRAMVoltAlert();
            console.log('API triggered at' + new Date().toLocaleTimeString());
          }, this.dataPollFrequency);

          if (this.renderFrequency) {
            this.savedFrequency = true;
            this.view = false;
          }
        });
      }
    });
  }


  selectedSuggestion = (suggestionResult) => {
    this.map.entities.clear();
    this.map.setView({ bounds: suggestionResult.bestView });
  }

  showRecentAssetDetails() {
    let params: any = {
      ASSET_ID: this.assetid
    }
    this.dashboardService.getAssetDetails(params)
      .subscribe(
        (res) => {
          var resData = JSON.parse(res["_body"]);
          this.recentData = resData;
          this.recentAssetData = this.getObjectKey(resData);
        }, (error) => {
          console.log("we are in error part" + error);
        });
  }

  showSelectedRecentAssetDetails(selectedAssetId) {
    let params: any = {
      ASSET_ID: selectedAssetId
    }
    this.dashboardService.getAssetDetails(params)
      .subscribe(
        (res) => {
          var resData = JSON.parse(res["_body"]);
          this.recentData = resData;
          this.recentAssetData = this.getObjectKey(resData);
        }, (error) => {
          console.log("we are in error part" + error);
        });
  }


  showInsightParameters() {
    let params: any = {
      ASSET_ID: this.assetid
    }
    this.dashboardService.getInsightParameters(params)
      .subscribe(
        (res) => {
          var resInsightData = JSON.parse(res["_body"]);
          this.recentInsightData = resInsightData;
        }, (error) => {
          console.log("we are in error part" + error);
        });
  }


  showSelectedInsightParameters(selectedAssetId) {
    let params: any = {
      ASSET_ID: selectedAssetId
    }
    this.dashboardService.getInsightParameters(params)
      .subscribe(
        (res) => {
          var resInsightData = JSON.parse(res["_body"]);
          this.recentInsightData = resInsightData;
        }, (error) => {
          console.log("we are in error part" + error);
        });
  }

  getInsightsData(){
    if (this.recentInsightData){
      var firstParameter = this.recentInsightData[0].parameter;
      this.getParameterData(firstParameter);
    }else{
      this.parameterMsg = "No Insights Data Available";
    }
    
  }

  getGraphsData(){
    if (this.recentInsightData){
      var firstParameter = this.recentInsightData[0].parameter;
      this.getParameterData(firstParameter);
      this.drawCharts(firstParameter);
    }else{
      this.parameterMsg = "No Insights Data Available";
    }
    
  }


  getObjectKey(obj) {
    var insightsArray = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var val = obj[key];
        for (var innerKey in val) {
          insightsArray.push(innerKey);
        }
      }
    }
    return insightsArray;
  }

  // function to get alerts data of an asset
  showRAMVoltAlert() {
    let params: any = {
      ASSET_ID: this.assetid
    }
    this.recentAlertsData = [];
    this.dashboardService.getRAMVoltAlert(params)
      .subscribe(
        (res) => {
          var resAlertsData = JSON.parse(res["_body"]);
          this.recentAlertsData = resAlertsData;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showSelectedRAMVoltAlert(selectedAssetId) {
    let params: any = {
      ASSET_ID: selectedAssetId
    }
    this.recentAlertsData = [];
    this.dashboardService.getRAMVoltAlert(params)
      .subscribe(
        (res) => {
          var resAlertsData = JSON.parse(res["_body"]);
          this.recentAlertsData = resAlertsData;
        },
        (err) => {
          console.log(err);
        }
      );
  }


  //function to filter the alerts inside map assets
  onFilterByAssetData(e) {
    var input, filter, ul, li, a, i, txtValue, selectedClassName;
    input = e.target.value;
    selectedClassName = e.target.className;
    selectedClassName = selectedClassName.toString();
    filter = input.toUpperCase();
    ul = document.getElementById("accordion");
    li = ul.getElementsByClassName("assetList");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByClassName(selectedClassName)[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }


  //function to filter the alerts on sidebar
  onFilterByAlertType(e) {
    var input, filter, ul, li, a, i, txtValue, selectedClassName;
    input = e.target.value;
    selectedClassName = e.target.className;
    selectedClassName = selectedClassName.toString();
    filter = input.toUpperCase();
    ul = document.getElementById("alertData");
    li = ul.getElementsByClassName("alert-list");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByClassName(selectedClassName)[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";

      }
    }
  }


  onFilterByAlertAmberType(e) {
    var input, filter, ul, li, a, i, txtValue, selectedClassName;
    input = e.target.value;
    selectedClassName = e.target.className;
    //console.log(selectedClassName);
    selectedClassName = selectedClassName.toString();
    filter = input.toUpperCase();
    ul = document.getElementById("alertAmberData");
    li = ul.getElementsByClassName("alert-list");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByClassName(selectedClassName)[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";

      }
    }
  }


  //function to fetch assets by Status
  onGetAssetbyStatus(deviceStatus) {
    let params: any = {
      DeviceStatus: deviceStatus
    };
    this.hideSidebar = false;
    this.isAlertsDataLoaded = false;
    this.hideAmberAlerts = true;
    this.hideRedAlerts = true;
    this.hideGreenAlerts = true;
    this.showAssetStatusList = false;
    this.showAssetTypesList = false;
    this.dashboardService.getAssetsByStatus(params).subscribe(
      (response: any) => {
        this.listAssetsByStatus = JSON.parse(response["_body"]);
        //console.log(this.listAssetsByStatus);
        this.showAssetStatusList = true;
        this.isAlertsDataLoaded = true;
        this.myassetStatus = deviceStatus;
        document.getElementById("right-sidebar-fully-loaded").style.display = "block";
      },
      (error) => {
        console.log('Failed to fetch assets by Status ' + error);
      });
  }

  // function to fetch assets by type
  onGetAssetbyType(assetType) {
    let params: any = {
      RAM_Asset_Type: assetType
    };
    this.hideSidebar = false;
    this.isAlertsDataLoaded = false;
    this.hideAmberAlerts = true;
    this.hideRedAlerts = true;
    this.hideGreenAlerts = true;
    this.showAssetStatusList = false;
    this.dashboardService.getAssetsByType(params).subscribe(
      (response: any) => {
        this.listAssetsByType = JSON.parse(response["_body"]);
        // console.log(this.listAssetsByType.length);
        this.showAssetTypesList = true;
        this.isAlertsDataLoaded = true;
        this.myassetType = assetType;
        document.getElementById("right-sidebar-fully-loaded").style.display = "block";
      },
      (error) => {
        console.log('Failed to fetch assets by type ' + error);
      });
  }

  closeSidebar() {
    //alert('hai')
    document.getElementById("right-sidebar-fully-loaded").style.display = "none";
  }

  // show data on clicking parameter name
  getParameterData(parameterName) {
    this.alertParameterName = parameterName;
    this.showParamLoader = true;
    this.chartData = [];
    let payload: any = {
      ASSET_ID: this.assetid,
      RAM_parameter: this.alertParameterName,
      Date: "month"
    }
    this.dashboardService.getChartData(payload).subscribe(
      (response: any) => {
        this.showParamLoader = false;
        this.rawParamData = JSON.parse(response["_body"]);
        //console.log("Parameter Data: " + JSON.stringify(this.rawParamData));
        //this.rawParamData = this.rawParamData[0];
        // console.log("Parameter Data: " + JSON.stringify(this.rawParamData));
        // console.log(this.rawParamData);
      },
      (error) => {
        console.log("Parameters Rendering Error" + error);
      });

  }

  onRedAlert(redalertscount) {
    this.redAlertsCount = redalertscount;
    let params: any = {
      RAM_Status: "Red"
    }
    this.hideSidebar = false;
    this.alertColor = "Red";
    this.showAssetTypesList = false;
    this.showAssetStatusList = false;
    this.isAlertsDataLoaded = false;
    this.hideAmberAlerts = true;
    this.hideGreenAlerts = true;
    this.dashboardService.sentAlertData(params).subscribe(
      (response: any) => {
        this.showAlertsCount();
        this.redAlerts = JSON.parse(response["_body"]);
        this.isAlertsDataLoaded = true;
        this.hideRedAlerts = false;
        document.getElementById("right-sidebar-fully-loaded").style.display = "block";
      },
      (error) => {
        console.log("Red Alert Failed with Error " + error);
      });
  }

  onAmberAlert(amberalertCount) {
    this.amberAlertsCount = amberalertCount;
    this.alertColor = "Amber";
    let params: any = {
      RAM_Status: "Amber"
    }
    this.hideSidebar = false;
    this.isAlertsDataLoaded = false;
    this.hideRedAlerts = true;
    this.hideGreenAlerts = true;
    this.showAssetStatusList = false;
    this.dashboardService.sentAlertData(params).subscribe(
      (response: any) => {
        this.showAlertsCount();
        this.amberAlerts = JSON.parse(response["_body"]);
        this.isAlertsDataLoaded = true;
        this.hideAmberAlerts = false;
        document.getElementById("right-sidebar-fully-loaded").style.display = "block";
      },
      (error) => {
        console.log("Amber Alert Failed with Error " + error);
      });
  }

  onGreenAlert(greenalertCount) {
    this.greenAlertsCount = greenalertCount;
    this.alertColor = "Green";
    let params: any = {
      RAM_Status: "Green"
    }
    this.hideSidebar = false;
    this.isAlertsDataLoaded = false;
    this.hideAmberAlerts = true;
    this.hideRedAlerts = true;
    this.showAssetStatusList = false;
    this.dashboardService.sentAlertData(params).subscribe(
      (response: any) => {
        this.greenAlerts = JSON.parse(response["_body"]);
        this.isAlertsDataLoaded = true;
        this.hideGreenAlerts = false;
        document.getElementById("right-sidebar-fully-loaded").style.display = "block";
      },
      (error) => {
        console.log("Green Alert Failed with Error " + error);
      });
  }

  // function to show alerts count in the smart view widget
  showAlertsCount() {
    this.dashboardService.getAlertsCount().subscribe(
      (res) => {
        var resData = JSON.parse(res["_body"]);
        if (resData) {
          this.assetWidgetLoader = true;

        }
        this.assetCount = resData[0].TotalAssetCount;
        this.IdleAssetCount = resData[0].idleAssetCount;
        this.AssetUtilCount = resData[0].assetUtilCount;
        this.AssetTypeCount = resData[0].assetTypeCount;
        this.MovableCount = resData[0].movableCount;
        this.NonMovableCount = resData[0].nonmovableCount;
        this.alertassetCount = resData[0].AlertAssetCount;
        this.redalert = resData[0].AlertRedCount;
        this.amberalert = resData[0].AlertAmberCount;
        this.greenalert = resData[0].AlertGreenCount;

      }
    )
  }

  closeAssetStatus() {
    this.assetsList = this.originalAssetsList;
    //console.log(this.assetsList);
  }

  // method to show selected asset from right sidebar online and offline assets
  goToSelectedAsset(selectedAssetId) {
    let payload = {
      "ASSET_ID": selectedAssetId
    }
    this.dashboardService.getParticularDeviceData(payload).subscribe(
      response => {
        this.particularAssetData = JSON.parse(response["_body"]);
        this.particularAssetData = this.particularAssetData[0];
        this.assetsList = [{
          RAM_AssetID: this.particularAssetData.RAM_AssetID,
          Frequency: this.particularAssetData.Frequency,
          RAM_Asset_Contact: this.particularAssetData.RAM_Asset_Contact,
          RAM_Asset_Type: this.particularAssetData.RAM_Asset_Type,
          RAM_Assetname: this.particularAssetData.RAM_Assetname,
          RAM_Latitude: this.particularAssetData.RAM_Latitude,
          RAM_Longitude: this.particularAssetData.RAM_Longitude,
          RAM_SensorkitID: this.particularAssetData.RAM_SensorkitID,
          RAM_Status: this.particularAssetData.RAM_Status,
          RAM_location: this.particularAssetData.RAM_location
        }];
        // tried to manipulate assetList array and call map on init. but no luck
        // also converted lat and log to number to ensure type 
        //this.mapOnInit();
        //console.log(this.assetsList[0].RAM_AssetID);
        this.assetid = this.assetsList[0].RAM_AssetID ? this.assetsList[0].RAM_AssetID : "No Data Available";
        this.assetsensor = this.assetsList[0].RAM_SensorkitID ? this.assetsList[0].RAM_SensorkitID : "No Data Available";
        this.assetcontact = this.assetsList[0].RAM_Asset_Contact ? this.assetsList[0].RAM_Asset_Contact : "No Data Available";
        this.assetname = this.assetsList[0].RAM_location ? this.assetsList[0].RAM_location : "No Data Available";
        this.status = this.assetsList[0].RAM_Status ? this.assetsList[0].RAM_Status : "No Data Available";
        this.renderFrequency = this.assetsList[0].Frequency ? this.assetsList[0].Frequency : "No Data Available";
        this.dataPollFrequency = this.renderFrequency * 60000;
          // Triggering Sensor Data Dispaying API based on Frequency Set on UI
          this.pollID = setInterval(() => {
            this.showRecentAssetDetails();
            this.showInsightParameters();
            this.showRAMVoltAlert();
            console.log('API triggered at' + new Date().toLocaleTimeString());
          }, this.dataPollFrequency);        
        let params: any = {
          RAM_SensorID: this.assetsensor
        }
        this.assetsService.getSensorKitParams(params)
          .subscribe(res => {
            this.sensorParameters = res;
            this.showInfo = true;
          });
      },
      error => {
        console.log(error);
      }
    )
    this.showSelectedRecentAssetDetails(selectedAssetId);
    this.showSelectedInsightParameters(selectedAssetId);
    this.showSelectedRAMVoltAlert(selectedAssetId);
    this.showInfo = true;
  }

  getAssetsList() {
    this.assetsService.getDeviceList()
      .subscribe(res => {
        this.assetsList = res;
        this.originalAssetsList = this.assetsList;
        this.mapOnInit();

        // for (let i = 0; i< this.assetsList.length; i++){
        //   this.renderFrequency = this.assetsList[i].Frequency;
        //   this.dataPollFrequency = this.renderFrequency * 60000;
        //   // Triggering Sensor Data Dispaying API based on Frequency Set on UI
        //   this.pollID = setInterval(() => {
        //     this.showRecentAssetDetails();
        //     this.showInsightParameters();
        //     this.showRAMVoltAlert();
        //     console.log('API triggered at' + new Date().toLocaleTimeString());
        //   }, this.dataPollFrequency);          
        // }
      });
  }

  listAllAssets() {
    this.assetsService.getDeviceList()
      .subscribe(res => {
        this.assetsList = res;
        this.originalAssetsList = this.assetsList;
      });
  }

  // function to show graph based on date selected from dropdown
  onSelectDateRange(selectedRange: string) {
    this.dateRange = selectedRange.toString();
    this.drawCharts(this.parameterName);
  }

  // function that accepts the dynamic insight parameter and draws the insight graph
  drawCharts(pname: string) {
    document.getElementById("showDatePicker").style.display = "block";
    //  console.log("drawcharts called with " + pname);
    this.parameterName = pname;
    this.chartData = [];
    let params: any = {
      ASSET_ID: this.assetid,
      RAM_parameter: pname,
      Date: this.dateRange
    }
    this.dashboardService.getChartData(params).subscribe(
      (response: any) => {
        this.rawchartData = JSON.parse(response["_body"]);
        var insightPropertyName = "rawvalue";
        var insightPropertyValue;
        //console.log("chartdata: " + JSON.stringify(this.rawchartData[0]));
        //console.log("chartdata: " + JSON.stringify(this.rawchartData));
        

        for (let i = 0; i < this.rawchartData.length; i++) {
          //console.log(this.rawchartData[0][i][insightPropertyName]);
          insightPropertyValue = this.rawchartData[i][insightPropertyName];
          insightPropertyValue = parseInt(insightPropertyValue);
          let latest_date =this.datePipe.transform(this.rawchartData[i].TIME_STAMP, 'yyyy-MM-dd');

          this.chartData.push({
            label: latest_date,
            y: insightPropertyValue
          });
        }
        this.drawChart(pname);
      },
      (error) => {
        console.log("Graph Rendering Error" + error);
      });
  }

  drawChart(pname) {
    //console.log('parameter name of y axis is');
    //console.log(pname);
    this.isGraphLoading = false;
    let chart = new CanvasJS.Chart("dataChart", {
      animationEnabled: false,
      exportEnabled: false,
      zoomEnabled: true,
      //theme:"dark2",
      title: {
        text: "Condition Insights",
        fontColor: "goldenrod",
        fontFamily: "Muli Roboto",
        fontSize: 19
        //fontWeight: "bold",
      },
      //click: this.onClick(),
      axisY: {
        title: pname,
        labelFontColor: "white",
        gridColor: "white",
        titleFontColor: "goldenrod",
        //interval:35,
        minimum: 0
      },
      axisX: {
        title: "Time",
        labelFontColor: "white",
        titleFontColor: "goldenrod",
        labelAngle: 20
      },
      backgroundColor: "#0000",
      height: 300,
      width: 580,
      data: [{
        type: "column",
        //indexLabel: " {y}",
        indexLabelFontColor: "white",
        indexLabelBackgroundColor: "yellow",
        toolTipContent: "{y}",
        dataPoints: this.chartData,
        dataPointWidth: 30,
      }]
    });
    chart.render();
  }


  pointToMapMarker(latLongList) {
    this.SumLat = 0;
    this.sumLong = 0;
    this._markers = [];
    for (let i = 0; i < latLongList.length; i++) {
      this._markers.push({ latitude: latLongList[i].CurrentLatitude, longitude: latLongList[i].CurrentLongitude });
      this.SumLat = this.SumLat + latLongList[i].CurrentLatitude;
      this.sumLong = this.sumLong + latLongList[i].CurrentLongitude;
    }

    this.avgNumericLat = (this.SumLat) / latLongList.length;
    this.avgNumericLong = (this.sumLong) / latLongList.length;

    this._options = {
      disableBirdseye: true,
      disableStreetside: true,
      navigationBarMode: 1,
      zoom: 2,
    };

    this._box = {
      maxLatitude: this.avgNumericLat + 25,
      maxLongitude: this.avgNumericLong + 25,
      minLatitude: this.avgNumericLat - 25,
      minLongitude: this.avgNumericLong - 25
    };

    this._iconInfo = {
      //  markerType: MarkerTypeId.ScaledImageMarker,
      url: 'place-24px.svg',
      scale: 0.07,
      markerOffsetRatio: { x: 0.5, y: 1 }
    };
    //this.displayMap = true;
  }

  // make first tab always active in map modal
  setDefaultTab() {
    $(document).ready(function(){
      $('a[href="#overview"]').tab('show'); 
    })
 
  }

}
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-po-summary',
  templateUrl: './po-summary.component.html',
  styleUrls: ['./po-summary.component.css']
})
export class PoSummaryComponent implements OnInit {

  public toggleStatus: boolean = false;
  public materialSteps:any;
  public poContent:any;

  constructor(private _router:Router) { }

  ngOnInit(): void {

    this.poContent = [
      {
        "M_No_of_steps":3,
        "Material_Info":{
            "M_Item_Num":1,
            "M_Material_Num":"13453466",
            "M_Item_Desc":"COM SWITCH BOX",
            "M_Order_Qty":12,
            "M_Unit":"Each",
            "M_Unit_Price":250,
            "M_Currency":"USD",
            "M_Status":"Green",
            "M_Due_date":"09/08/2020",
            "M_Projected_Due_Date":"09/07/2020",
            "M_Current_Step":"Drilling",
            "M_Current_Step_Due_date":"02/07/2020",
            "M_Shipment_Tracking_ID":""              
        } ,   
        "Actual_Steps":[
          {
            "P_Step_order":1,
            "P_Step_name":"Receiving Raw Materials"
          },
          {
            "P_Step_order":2,
            "P_Step_name":"Incoming Inspection"
          },
          {
            "P_Step_order":3,
            "P_Step_name":"Milling"
          },
          {
            "P_Step_order":4,
            "P_Step_name":"Drilling & Threading"
          } ,
          {
            "P_Step_order":5,
            "P_Step_name":"Post Processing"
          },
          {
            "P_Step_order":6,
            "P_Step_name":"Quality Check"
          },
          {
            "P_Step_order":7,
            "P_Step_name":"Packing & Dispatch"
          },
          {
            "P_Step_order":8,
            "P_Step_name":"Shipped"
          }                                                     
        ],
        "Updated_Steps":[
          {
            "I_Step_Order":1,
            "I_Step_Name":"Receiving Raw Materials",
            "I_Status":"Green",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          },
          {
            "I_Step_Order":2,
            "I_Step_Name":"Incoming Inspection",
            "I_Status":"Red",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          },
          {
            "I_Step_Order":3,
            "I_Step_Name":"Milling",
            "I_Status":"Orange",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          },
          {
            "I_Step_Order":4,
            "I_Step_Name":"Drilling & Threading",
            "I_Status":"Green",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          }                        
        ]
      },
      {
        "M_No_of_steps":3,
        "Material_Info":{
            "M_Item_Num":1,
            "M_Material_Num":"13453466",
            "M_Item_Desc":"AIR MUF,AC980,1/4 IN NPT",
            "M_Order_Qty":12,
            "M_Unit":"Each",
            "M_Unit_Price":250,
            "M_Currency":"USD",
            "M_Status":"Green",
            "M_Due_date":"09/07/2020",
            "M_Projected_Due_Date":"09/07/2020",
            "M_Current_Step":"Drilling",
            "M_Current_Step_Due_date":"09/07/2020",
            "M_Shipment_Tracking_ID":"AWB34231235"              
        },    
        "Actual_Steps":[
          {
            "P_Step_order":1,
            "P_Step_name":"Receiving Raw Materials"
          },
          {
            "P_Step_order":2,
            "P_Step_name":"Incoming Inspection"
          },
          {
            "P_Step_order":3,
            "P_Step_name":"Shipped"
          }                                                     
        ],
        "Updated_Steps":[
          {
            "I_Step_Order":1,
            "I_Step_Name":"Receiving Raw Materials",
            "I_Status":"Green",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          },
          {
            "I_Step_Order":2,
            "I_Step_Name":"Incoming Inspection",
            "I_Status":"Red",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          },
          {
            "I_Step_Order":3,
            "I_Step_Name":"Shipped",
            "I_Status":"Finish",
            "I_Step_Start_Date":"09/07/2020",
            "I_Step_due_Date":"09/07/2020",
            "I_Step_Completion_due_date":"09/07/2020"
          }                        
        ]
      }
  ]

    this.materialSteps = {
      "M_No_of_steps":3,
      "Material_Info":{
        "M_Item_Num":1,
        "M_Material_Num":"13453466",
        "M_Item_Desc":"COM SWITCH Box",
        "M_Order_Qty":12,
        "M_Unit":"Each",
        "M_Unit_Price":250,
        "M_Currency":"USD",
        "M_Status":"Green",
        "M_Due_date":"10/07/2020",
        "M_Projected_Due_Date":"17/07/2020",
        "M_Current_Step":"Drilling",
        "M_Current_Step_Due_date":"08/07/2020",
        "M_Shipment_Tracking_ID":"AWB34231235"              
    }  ,     
      "Actual_Steps":[
        {
          "P_Step_order":1,
          "P_Step_name":"Receiving Raw Materials"
        },
        {
          "P_Step_order":2,
          "P_Step_name":"Incoming Inspection"
        },
        {
          "P_Step_order":3,
          "P_Step_name":"Milling"
        },
        {
          "P_Step_order":4,
          "P_Step_name":"Drilling & Threading"
        } ,
        {
          "P_Step_order":5,
          "P_Step_name":"Post Processing"
        },
        {
          "P_Step_order":6,
          "P_Step_name":"Quality Check"
        },
        {
          "P_Step_order":7,
          "P_Step_name":"Packing & Dispatch"
        },
        {
          "P_Step_order":8,
          "P_Step_name":"Shipped"
        }                                                     
      ],
      "Updated_Steps":[
        {
          "I_Step_Order":1,
          "I_Step_Name":"Receiving Raw Materials",
          "I_Status":"Green",
          "I_Step_Start_Date":"09/07/2020",
          "I_Step_due_Date":"09/07/2020",
          "I_Step_Completion_due_date":"09/07/2020"
        },
        {
          "I_Step_Order":2,
          "I_Step_Name":"Incoming Inspection",
          "I_Status":"Red",
          "I_Step_Start_Date":"09/07/2020",
          "I_Step_due_Date":"09/07/2020",
          "I_Step_Completion_due_date":"09/07/2020"
        },
        {
          "I_Step_Order":3,
          "I_Step_Name":"Milling",
          "I_Status":"Orange",
          "I_Step_Start_Date":"09/07/2020",
          "I_Step_due_Date":"09/07/2020",
          "I_Step_Completion_due_date":"09/07/2020"
        },
        {
          "I_Step_Order":4,
          "I_Step_Name":"Drilling & Threading",
          "I_Status":"Finish",
          "I_Step_Start_Date":"09/07/2020",
          "I_Step_due_Date":"09/07/2020",
          "I_Step_Completion_due_date":"09/07/2020"
        }                        
      ]
    };

    }
 
  toggleItems(){
      this.toggleStatus = !this.toggleStatus;       
  }
  backToDashboard(){
    this._router.navigateByUrl('dashboard');
  }

}

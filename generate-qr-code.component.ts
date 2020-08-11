import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../Service/app.service';
@Component({
  selector: 'app-generate-qr-code',
  templateUrl: './generate-qr-code.component.html',
  styleUrls: ['./generate-qr-code.component.scss']
})
export class GenerateQRCodeComponent implements OnInit {

  Location: string;
  EmployeeId: string;
  showFirstNext = true;
  showSecondNext = false;
  showThirdNext = false;
  showFourthNext = false;
  ResponseObject: any;
  showResponse = false;
  showBarcode = false;
  Status:any;
  selfDeclarationStatus:String;
  Q1Answer: string;Q2Answer: string;Q3Answer: string;Q4Answer: string;Q5Answer: string;Q6Answer: string;Q7Answer: string;Q8Answer: string;Q9Answer: string;Q10Answer: string;Q11Answer: string;

  Q1AnswerStatus:String; Q2AnswerStatus:String; Q3AnswerStatus:String;Q4AnswerStatus:String;Q5AnswerStatus:String;Q6AnswerStatus:String;Q7AnswerStatus:String;Q8AnswerStatus:String;Q9AnswerStatus:String;Q10AnswerStatus:String;Q11AnswerStatus:String;

  constructor(private app: AppService) { }

  ngOnInit() {
    this.showResponse = false;
    this.showBarcode = false;
    this.EmployeeId = sessionStorage.getItem('EmployeeId');
    this.Location = sessionStorage.getItem('storeId')
    this.Q1Answer = '';
    this.Q2Answer = '';
    this.Q3Answer = '';
    this.Q4Answer = '';
    this.Q5Answer = '';
    this.Q6Answer = '';
    this.Q7Answer = '';
    this.Q8Answer = '';
    this.Q9Answer = '';
    this.Q10Answer = '';
    this.Q11Answer = '';
  }

  showSecondNextButton() {
    if (this.Q1Answer === '' || this.Q2Answer === '' || this.Q3Answer === '') {
      alert('Please Answer All the Questions')
    } else {
      this.showFirstNext = false;
      this.showSecondNext = true;
      this.showThirdNext = false;
      this.showFourthNext = false
    }

  }

  showThirdNextButton() {
    if (this.Q4Answer === '' || this.Q5Answer === '' || this.Q6Answer === '') {
      alert('Please Answer All the Questions')
    } else {
      this.showFirstNext = false;
      this.showSecondNext = false;
      this.showThirdNext = true;
      this.showFourthNext = false
    }
  }

  showFourthNextButton() {
    if (this.Q7Answer === '' || this.Q8Answer === '' || this.Q9Answer === '') {
      alert('Please Answer All the Questions')
    } else {
      this.showFirstNext = false;
      this.showSecondNext = false;
      this.showThirdNext = false;
      this.showFourthNext = true;
    }
  }

  SubmitEmployeeQA() {
    this.Q1Answer === 'I have not volunteered to come to office' ? this.Q1AnswerStatus = "Failure" : this.Q1AnswerStatus = "Success";
    this.Q2Answer === 'I have one of these symptoms - Fever, Dry cough, Body Ache, Headaches, Sore throat, Runny Nose, Tiredness, and Shortness of Breath' ? this.Q2AnswerStatus = "Failure" : this.Q2AnswerStatus = "Success";
    this.Q3AnswerStatus = "Success"; // there was no existing validation applied on question of arogya setu app
    this.Q4Answer === 'Yes' ? this.Q4AnswerStatus = "Failure" : this.Q4AnswerStatus = "Success";
    this.Q5Answer === 'Yes' ? this.Q5AnswerStatus = "Failure" : this.Q5AnswerStatus = "Success";    
    this.Q6Answer === 'Deny' ? this.Q6AnswerStatus = "Failure" : this.Q6AnswerStatus = "Success";  
    this.Q7Answer === 'Deny' ? this.Q7AnswerStatus = "Failure" : this.Q7AnswerStatus = "Success";  
    this.Q8Answer === 'Yes' ? this.Q8AnswerStatus = "Failure" : this.Q8AnswerStatus = "Success";  
    this.Q9Answer === 'I do not accept the guidelines & policies mentioned above' ? this.Q9AnswerStatus = "Failure" : this.Q9AnswerStatus = "Success";  
    this.Q10Answer === 'Decline' ? this.Q10AnswerStatus = "Failure" : this.Q10AnswerStatus = "Success";  
    this.Q11Answer == 'No' ? this.Q11AnswerStatus = "Failure" : this.Q11AnswerStatus = "Success";      


    if (this.Q10Answer === '') {
      alert('Please Answer the above question')
    } 
    else if(
      this.Q1Answer === 'I have not volunteered to come to office' || 
      this.Q2Answer === 'I have one of these symptoms - Fever, Dry cough, Body Ache, Headaches, Sore throat, Runny Nose, Tiredness, and Shortness of Breath' || 
      this.Q4Answer === 'Yes' || 
      this.Q5Answer === 'Yes' || 
      this.Q6Answer === 'Deny' || 
      this.Q7Answer === 'Deny' || 
      (this.Q8Answer === 'Yes' && this.Q11Answer == 'No') || 
      this.Q9Answer === 'I do not accept the guidelines & policies mentioned above' || 
      this.Q10Answer === 'Decline' || this.Q11Answer === 'No') {
        //this.showResponse = true;
        this.showBarcode = false;
        this.selfDeclarationStatus = "Failure";
    } else{
      this.selfDeclarationStatus = "Success";
    }


      let payload = {
        //"Location": this.Location,
        "EmployeeId": this.EmployeeId,
        "Status":this.selfDeclarationStatus,
        "QuestionResponses": [{
            "Question": "Q1",
            "Answer": this.Q1Answer,
            "AnswerStatus":this.Q1AnswerStatus

          }, 
          {
            "Question": "Q2",
            "Answer": this.Q2Answer,
            "AnswerStatus":this.Q2AnswerStatus
          }, 
          {
          "Question": "Q3",
          "Answer": this.Q3Answer,
          "AnswerStatus":this.Q3AnswerStatus
          }, 
          {
            "Question": "Q4",
            "Answer": this.Q4Answer,
            "AnswerStatus":this.Q4AnswerStatus
          }, 
          {
            "Question": "Q5",
            "Answer": this.Q5Answer,
            "AnswerStatus":this.Q5AnswerStatus
          }, 
          {
            "Question": "Q6",
            "Answer": this.Q6Answer,
            "AnswerStatus":this.Q6AnswerStatus
          }, 
          {
            "Question": "Q7",
            "Answer": this.Q7Answer,
            "AnswerStatus":this.Q7AnswerStatus
          }, 
          {
            "Question": "Q8",
            "Answer": this.Q8Answer,
            "AnswerStatus":this.Q8AnswerStatus
          }, 
          {
            "Question": "Q9",
            "Answer": this.Q9Answer,
            "AnswerStatus":this.Q9AnswerStatus
          }, 
          {
            "Question": "Q10",
            "Answer": this.Q10Answer,
            "AnswerStatus":this.Q10AnswerStatus
          },
          {
          "Question": "Q11",
          "Answer": this.Q11Answer,
          "AnswerStatus":this.Q11AnswerStatus
          }
        ]
      }

      console.log(payload);  
      this.app.postQuestionaireResponse(payload).subscribe(res => {
        this.ResponseObject = res
        if (this.ResponseObject.Message === 'Not Approved') {
          this.showResponse = true;
        } else {
          this.showBarcode = true;
        }
      })
    
  }
}

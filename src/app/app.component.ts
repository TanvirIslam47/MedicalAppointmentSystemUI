
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppointmentDto, AppointmentService, DoctorDto, MedicineDto, PatientDto, PrescriptionDto } from '../core/services/appointment.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../core/services/notification.service';

pdfMake.vfs = pdfFonts.vfs;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
 
  constructor() { }

  ngOnInit(): void {

  }

 
}

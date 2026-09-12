import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PatientDto, DoctorDto, MedicineDto, AppointmentDto, AppointmentService, PrescriptionDto } from '../../core/services/appointment.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss'
})
export class AppointmentListComponent implements OnInit {
  appointmentForm!: FormGroup;
  patients: PatientDto[] = [];
  doctors: DoctorDto[] = [];
  medicines: MedicineDto[] = [];
  appointments: AppointmentDto[] = [];
  selectedAppointment?: AppointmentDto;
  userRole: string = '';
  searchText = '';
  selectedDoctor = '';
  selectedVisitType = '';
  showForm = false;
  editMode = false;
  totalCount = 0;
  pageNumber = 1;
  pageSize = 5;

  



  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private notify: NotificationService) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userRole = user.role;
    this.initForm();
    this.loadData();
    this.getAppointments();
  }

  get filteredAppointments() {
    return this.appointments.filter(appt => {
      return (
        (this.searchText === '' || appt.patientName.toLowerCase().includes(this.searchText.toLowerCase())) &&
        (this.selectedDoctor === '' || appt.doctorName === this.selectedDoctor) &&
        (this.selectedVisitType === '' ||
          appt.visitType?.trim().toLowerCase() === this.selectedVisitType.trim().toLowerCase())

      );

    });

  }

 loadData(): void {
  this.appointmentService.getPatients().subscribe({
    next: (res) => {
      this.patients = res;
    },
    error: (err) => {
      this.notify.error('Failed to load patients');
    }
  });

  this.appointmentService.getDoctors().subscribe({
    next: (res) => {
      this.doctors = res;
    },
    error: (err) => {
      this.notify.error('Failed to load doctors');
    }
  });

  this.appointmentService.getMedicines().subscribe({
    next: (res) => {
      this.medicines = res;
    },
    error: (err) => {
      this.notify.error('Failed to load medicines ');
    }
  });
}


  getAppointments(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    const role = user.role;
    const contact = user.mobile;
   this.appointmentService.getAppointments(this.pageNumber, this.pageSize,role, contact).subscribe({
    next: (res) => {
      this.appointments = res.results;
      this.totalCount = res.totalCount;
    },
    error: (err) => console.error('Error fetching appointments', err)
  });
  }

  viewDetails(id: number): void {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (res) => this.selectedAppointment = res,
      error: (err) => console.error('Error fetching appointment:', err)
    });
  }
  get prescriptions(): FormArray {
    return this.appointmentForm.get('prescriptions') as FormArray;
  }

  addPrescription(pres?: PrescriptionDto): void {
      const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toISOString().split('T')[0];
  };
    const group = this.fb.group({
      medicineId: [pres ? pres.medicineId : '', Validators.required],
      dosage: [pres ? pres.dosage : '', Validators.required],
      startDate: [pres ? formatDate(pres.startDate) : '', Validators.required],
      endDate: [pres ? formatDate(pres.endDate) : '', Validators.required],
      notes: [pres ? pres.notes : '']
    });
    this.prescriptions.push(group);
  }

  removePrescription(i: number): void {
    this.prescriptions.removeAt(i);
  }
  onAdd(): void {
    this.editMode = false;
    this.showForm = true;
    this.initForm();
  }

  onEdit(appt: AppointmentDto): void {
    console.log('Editing appointment:', appt);
    this.editMode = true;
    this.showForm = true;
    this.initForm();

    this.appointmentForm.patchValue({
      appointmentId: appt.appointmentId,
      patientId: appt.patientId,
      patientEmail: (appt as AppointmentDto & { patientEmail?: string }).patientEmail,
      doctorId: appt.doctorId,
      appointmentDate: appt.appointmentDate.split('T')[0],
      visitType: appt.visitType,
      diagnosis: appt.diagnosis,
      notes: appt.notes
    });

    appt.prescriptions.forEach(p => this.addPrescription(p));
  }




  onSubmit(): void {
    if (this.appointmentForm.invalid) return;

    const formValue = this.appointmentForm.value;
    const patient = this.patients.find(p => p.patientId === Number(formValue.patientId));
    const appointmentPayload = {
      ...formValue,
      patientEmail: patient?.patientEmail ?? formValue.patientEmail
    };

    if (this.editMode) {
      this.appointmentService.updateAppointment(formValue.appointmentId, appointmentPayload)
        .subscribe({
          next: (res) => {
            this.notify.success('Appointment Updated successfully', 'Success');
            this.getAppointments();
            this.showForm = false;
          },
          error: (err) => console.error('Error updating appointment', err)
        });
    } else {

      this.appointmentService.saveAppointment(appointmentPayload).subscribe({
        next: res => {
          this.notify.success('Appointment saved and Email Send successfully', 'Success');
          this.getAppointments();
          this.showForm = false;
        },
        error: err => {
          this.notify.error('Failed to save appointment', 'Error');
        }
      });
    }

  }


  deleteAppointment(id: number): void {
    if (!confirm(`Are you sure you want to delete appointment #${id}?`)) return;

    this.appointmentService.deleteAppointment(id).subscribe({
      next: (res) => {
        this.notify.success('Appointment Deleted successfully', 'Success');
        this.appointments = this.appointments.filter(a => a.appointmentId !== id);
        this.getAppointments();
      },
      error: (err) => {
        this.notify.error('Failed to save appointment', 'Error');
      }
    });
  }



  downloadAppointmentsPdf(appointmentId: number) {
    const appt = this.appointments.find(a => a.appointmentId === appointmentId);
    if (!appt) return;

    const prescriptionBody: (string | { text: string; bold?: boolean })[][] = [
      [
        { text: 'Medicine', bold: true },
        { text: 'Dosage', bold: true },
        { text: 'Start Date', bold: true },
        { text: 'End Date', bold: true },
        { text: 'Notes', bold: true }
      ],
      ...appt.prescriptions.map(pres => [
        pres.medicineName || `Medicine ${pres.medicineId}`,
        pres.dosage,
        new Date(pres.startDate).toLocaleDateString(),
        new Date(pres.endDate).toLocaleDateString(),
        pres.notes
      ])
    ];

    const docDefinition: TDocumentDefinitions = {
      content: [
        { text: 'Prescription Report', style: 'header' },
        { text: `Patient: ${appt.patientName}`, margin: [0, 0, 0, 2] },
        { text: `Doctor: ${appt.doctorName}`, margin: [0, 0, 0, 2] },
        { text: `Date: ${new Date(appt.appointmentDate).toLocaleDateString()}`, margin: [0, 0, 0, 2] },
        { text: `Visit Type: ${appt.visitType}`, margin: [0, 0, 0, 10] },

        { text: 'Prescriptions', style: 'subheader', margin: [0, 5, 0, 5] },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*'],
            body: prescriptionBody
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center' as any,
          margin: [0, 0, 0, 10] as [number, number, number, number,]
        },
        subheader: {
          fontSize: 14,
          bold: true
        }
      },
      defaultStyle: {
        fontSize: 10
      }
    };
    pdfMake.createPdf(docDefinition as TDocumentDefinitions).download(`Prescription_${appt.patientName}.pdf`);

  }


  initForm(): void {
    this.appointmentForm = this.fb.group({
      appointmentId: [0],
      patientId: ['', Validators.required],
      patientEmail: [''],
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      visitType: ['First', Validators.required],
      diagnosis: [''],
      notes: [''],
      prescriptions: this.fb.array([])
    });
  }

  get totalPages(): number {
  return Math.ceil(this.totalCount / this.pageSize);
}

 goPrevious() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getAppointments();
    }
  }

  goNext() {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getAppointments();
    }
  }

  onCancel(): void {
    this.showForm = false;
  }
}
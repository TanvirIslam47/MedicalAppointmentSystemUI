import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../core/services/appointment.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.scss'
})
export class AppointmentComponent  implements OnInit {
  appointmentForm!: FormGroup;
  departments: any[] = [];
  doctors: any[] = [];
  filteredDoctors: any[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDropdowns();
  }

  onDepartmentChange(event: any): void {
  const deptId = +event.target.value; // convert to number
// .filter(d => d.departmentId === deptId)
  if (deptId) {
    this.filteredDoctors = this.doctors;
  } else {
    this.filteredDoctors = [];
  }

  // Reset doctor selection when department changes
  this.appointmentForm.patchValue({ doctorId: '' });
}

  initForm(): void {
    this.appointmentForm = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      address: [''],
      patientEmail: ['', [Validators.required, Validators.email]],
      departmentId: ['', Validators.required],
      doctorId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      notes: ['']
    });
  }

  loadDropdowns(): void {
    this.appointmentService.getDepartments().subscribe({
      next: (res) => (this.departments = res),
      error: () => this.toastr.error('Failed to load departments')
    });

    this.appointmentService.getDoctors().subscribe({
      next: (res) => (this.doctors = res),
      error: () => this.toastr.error('Failed to load doctors')
    });
  }

  onSubmit(): void {
    if (this.appointmentForm.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    this.appointmentService.createAppointment(this.appointmentForm.value).subscribe({
      next: () => {
        this.toastr.success('Appointment booked successfully');
        this.appointmentForm.reset();
      },
      error: () => this.toastr.error('Failed to save appointment')
    });
  }
}
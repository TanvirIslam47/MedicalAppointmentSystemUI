import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
  loading = false;
signupForm!: FormGroup;


  constructor(private fb: FormBuilder, private auth: AuthService, private toastr: ToastrService) {}
  
   ngOnInit(): void {
    this.initForm();

  }

  onSubmit() {
    if (this.signupForm.invalid) return;

    this.loading = true;
    this.auth.register(this.signupForm.value).subscribe({
      next: () => {
        this.toastr.success('Registration successful');
        this.signupForm.reset({ role: 'User' });
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Registration failed');
        this.loading = false;
      }
    });
  }
initForm(): void {
    this.signupForm = this.fb.group({
    fullName: ['', Validators.required],
    mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['User', Validators.required]
  });
}
}

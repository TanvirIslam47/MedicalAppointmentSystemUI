import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private toastr: ToastrService,private router: Router) {}
     ngOnInit(): void {
    this.initForm();

  }


  onLogin() {
    if (this.loginForm.invalid) return;

    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Login successful');
        this.auth.setUser(res.user);
        this.router.navigate(['/appointment']);
      },
      error: () => {
        this.toastr.error('Invalid credentials');
      }
    });
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      mobile: ['', Validators.required],
    password: ['', Validators.required]
      // mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      // password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}

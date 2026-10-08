import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  userFullName: string | null = null;
  canViewAppointmentList = false;

  constructor(private router: Router, private auth: AuthService,) {}

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.userFullName = user ? user.fullName || user.FullName : null;
      this.canViewAppointmentList = user?.role === 'Admin' || user?.role === 'Doctor';
    });
  }

   logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
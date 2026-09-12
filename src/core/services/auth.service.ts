import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSource = new BehaviorSubject<any>(null);
  user$ = this.userSource.asObservable();
  private baseUrl = 'http://localhost:5265/api';

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) this.userSource.next(JSON.parse(user));
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

   setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSource.next(null);
  }
}

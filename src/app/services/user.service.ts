import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) {}

  addUserWithConfPassword(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/addwithconfpassword`, formData, { responseType: 'text' });
  }
}

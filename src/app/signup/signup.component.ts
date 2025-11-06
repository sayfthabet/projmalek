import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8081/api/user';

  constructor(private http: HttpClient) {}

  addUserWithConfPassword(formData: FormData): Observable<any> {
    // Important : ne pas mettre Content-Type ici, Angular le gère automatiquement pour multipart
    return this.http.post(`${this.baseUrl}/addwithconfpassword`, formData, { responseType: 'text' });
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user = {
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    address: '',
    password: '',
    confirmPassword: '',
    cin: 0,
    telephone: 0,
    age: 0,
    roleName: '' // correspond au champ roleName du DTO
  };

  selectedFile: File | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();

    // ✅ Transformer l'objet user en Blob JSON pour Spring @RequestPart
    formData.append(
      'user',
      new Blob([JSON.stringify(this.user)], { type: 'application/json' })
    );

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.userService.addUserWithConfPassword(formData).subscribe({
      next: (response) => {
        alert('✅ Compte créé avec succès !');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        alert('❌ Erreur lors de la création du compte : ' + error.message);
      }
    });
  }
}

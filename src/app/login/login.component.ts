import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Variables liées aux champs du formulaire
  username = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  // Fonction déclenchée à l'envoi du formulaire
  onSubmit() {
    const loginData = { username: this.username, password: this.password };

    this.http.post<any>('http://localhost:8081/api/auth/login', loginData)
      .subscribe({
        next: res => {
          // Récupération du user et du token
          const user = res.user;
          const token = res.token;

          // Stockage des infos dans le service AuthService
          this.authService.login(user, token);

          // Redirection vers la page d'accueil
          this.router.navigate(['/accueil']);
        },
        error: err => {
          // Gestion des erreurs
          alert('Nom d’utilisateur ou mot de passe incorrect !');
          console.error(err);
        }
      });
  }
}

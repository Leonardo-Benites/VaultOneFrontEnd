import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
declare var bootstrap: any;  

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  private apiUserUrl = 'https://localhost:7259/Api/User';
  modal: any;
  
  newUser = {
    Id: 0,
    Name: '',
    Email: '',
    Password: '',
    Profile: 0 
  };

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  login() {
    const credentials = { email: this.email, password: this.password };
    console.log(credentials);

    this.authService.login(credentials).subscribe({
      next: (response) => {
        alert(response.message);
        localStorage.setItem('token', response.token);
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = 'Invalid email or password';
      },
    });
  }

  openRegisterModal() {
    if (!this.modal) {
      const modalElement = document.getElementById('registerModal');
      this.modal = new bootstrap.Modal(modalElement);
    }
    
    this.newUser = {
      Id: 0,
      Name: '',
      Email: '',
      Password: '',
      Profile: 0
    };
    
    this.modal.show();

  }

  register() {
    console.log("bateu aqui");
    this.newUser.Profile = +this.newUser.Profile;

    if (this.newUser.Name && this.newUser.Email && this.newUser.Password && this.newUser.Profile) {
      this.http.post<any>(`${this.apiUserUrl}/Create`, this.newUser).subscribe({
        next: (response) => {
          alert(response.message);
          this.modal.hide();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    } else {
      alert('Please fill in all fields');
    }
  }
  
}

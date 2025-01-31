import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
declare var bootstrap: any;  

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class UsersComponent {
  private apiUrl = 'https://localhost:7259/Api/User';
  modal: any;
  
  selectedUserId: number = 0; 

  newUser = {
    Id: 0,
    Name: '',
    Email: '',
    Password: '',
    Profile: 0 
  };

  updatedUser = {
    Id: 0,
    Name: '',
    Password: '',
    Profile: 0 
  };

  users: any[] = [];
  filterText = '';

 constructor(private http: HttpClient) {}
 
   ngOnInit() {
     this.loadUsers();
     if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
      alert('Usuários padrão só têm acesso à criação de novos usuários.');
    }
   }
 
   loadUsers() {
    this.http.get<any>(`${this.apiUrl}/GetUsers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (response) => {
        console.log(response.data);
        this.users = response.data;
      },
      error: (err) => {
        alert(err.error.message);
        alert(err.message);
        console.error('Failed to load users:', err);
      }
    });
  }

   get filteredUsers() {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

   openCreateModal() {
    if (!this.modal) {
      const modalElement = document.getElementById('createModal');
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

  openUpdateModal(user: any) {
    if (!this.modal) {
      const modalElement = document.getElementById('updateModal');
      this.modal = new bootstrap.Modal(modalElement);
    }
    
    this.updatedUser = {
      Id: user.id,
      Name: user.name,
      Password: user.password,
      Profile: user.profile
    };
    
    this.selectedUserId = user.id;
    this.modal.show();
  }

  openDeleteModal(userId: number) {
    console.log(userId);
    const modalElement = document.getElementById('deleteModal');
    this.modal = new bootstrap.Modal(modalElement);
    this.selectedUserId = userId;
    this.modal.show();
  }
  
  createUser() {
    this.newUser.Profile = +this.newUser.Profile;  // The + operator converts it to a number

    if (this.newUser.Name && this.newUser.Email && this.newUser.Password) {
      this.http.post<any>(`${this.apiUrl}/Create`, this.newUser).subscribe({
        next: (response) => {
          alert(response.message);
          this.modal.hide();
          window.location.reload();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    } else {
      alert('Please fill in all fields');
    }
  }

  updateUser() {
    if (this.updatedUser.Name && this.updatedUser.Password) {
      this.http.put<any>(`${this.apiUrl}/Update/${this.selectedUserId}`, this.updatedUser, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }).subscribe({
        next: (response) => {
          alert(response.message);
          this.modal.hide();
          window.location.reload();
        },
        error: (err) => {
          alert(err.error.message);
        }
      });
    } else {
      alert('Please fill in all fields');
    }
  }

  deleteUser() {
    this.http.delete<any>(`${this.apiUrl}/Delete/${this.selectedUserId}`, { 
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe({
      next: (response) => {
        alert(response.message);
        this.modal.hide();
        window.location.reload();
      },
      error: (err) => {
        alert(err.error.message);
      }
    });
  }
}

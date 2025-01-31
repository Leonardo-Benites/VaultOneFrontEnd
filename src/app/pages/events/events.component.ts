import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  
declare var bootstrap: any;  

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EventsComponent {
  private apiUrl = 'https://localhost:7259/Api/Event';
  private apiUserUrl = 'https://localhost:7259/Api/User';
  modal: any;
  selectedEventId: number = 0; 
  selectedUserIds: number[] = [];

  startDate: string = ''; 
  endDate: string = ''; 

  newEvent = {
    Id: 0,
    Name: '',
    Description: '',
    KeyWords: '',
    Date: new Date(),
    Type: 0,
    UserIds: [] as number[]
  };

  updatedEvent = {
    Id: 0,
    Name: '',
    Description: '',
    KeyWords: '',
    Date: new Date(),
    Type: 0,
    UserIds : [] as number[]
  };

  updatedEventDateString = '';
  events: any[] = [];
  users: any[] = [];
  filterText = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
      alert('Somente administradores podem gerenciar eventos.');
    }
  }

  searchEvents() {
    this.loadEvents();
  }

  loadEvents() {
    const token = localStorage.getItem('token');
    let params: any = {};

    if (this.filterText) {
      params.KeyWords = this.filterText;
    }
    if (this.startDate) {
      params.Date = this.startDate;
    }

    if (!token) {
      this.http.get<any>(`${this.apiUrl}/GetPublicEvents`, { params }).subscribe({
        next: (response) => {
          this.events = response.data;
        },
        error: (err) => {
          alert(err.error.message);
          console.error('Erro ao carregar eventos públicos:', err);
        }
      });
    } else {
      this.http.get<any>(`${this.apiUrl}/GetMyEventsAndPublic`, {
        headers: { Authorization: `Bearer ${token}` }, params
      }).subscribe({
        next: (response) => {
          this.events = response.data;
        },
        error: (err) => {
          console.log(err);
          console.error('Erro ao carregar eventos:', err);
          alert(err.error.message);
        }
      });
    }
  }

  loadUsers() {
    this.http.get<any>(`${this.apiUserUrl}/GetUsers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        alert(err.error.message);
        console.error('Failed to load users:', err);
      }
    });
  }

  onUserSelect(user: any) {
    if (user.selected) {
      this.selectedUserIds.push(user.id);  
    } else {
      this.selectedUserIds = this.selectedUserIds.filter(id => id !== user.id); 
    }
  }

  openCreateModal() {
    const token = localStorage.getItem('token');
    if(!token){
      alert("Você precisa estar logado para criar um evento.")
    }
    else{
      const modalElement = document.getElementById('createModal');
      this.modal = new bootstrap.Modal(modalElement);
  
      this.loadUsers()
  
      this.newEvent = {
        Id: 0,
        Name: '',
        Description: '',
        KeyWords: '',
        Date: new Date(),
        Type: 0,
        UserIds: []
      };
      
      this.modal.show();
    }  
  }

  openUpdateModal(event: any) {
    const modalElement = document.getElementById('updateModal');
    this.modal = new bootstrap.Modal(modalElement);

    const dateString = event.date ? new Date(event.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    this.updatedEvent = {
      Id: event.id,
      Name: event.name,
      Description: event.description,
      KeyWords: event.keyWords,
      Date: event.Date,
      Type: event.type,
      UserIds: event.userIds,
    };

    this.updatedEventDateString = dateString;
    this.selectedEventId = event.id;
  
    this.http.get<any>(`${this.apiUserUrl}/GetUsers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).subscribe({
      next: (response) => {
        this.users = response.data;

        this.users.forEach(user => {
          user.selected = event.userIds.includes(user.id);
        });
        
      },
      error: (err) => {
        alert(err.error.message);
        console.error('Failed to load users:', err);
      }
    });
  
    this.modal.show();
  }

  openDeleteModal(eventId: number) {
    const modalElement = document.getElementById('deleteModal');
    this.modal = new bootstrap.Modal(modalElement);
    this.selectedEventId = eventId;
    this.modal.show();
  }
  
  createEvent() {
    console.log(this.selectedUserIds);
    this.newEvent.UserIds = this.selectedUserIds;
    this.newEvent.Type = +this.newEvent.Type;  
    
    if (this.newEvent.Name && this.newEvent.Description && this.newEvent.KeyWords) {
      this.http.post<any>(`${this.apiUrl}/Create`, this.newEvent, {
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
          alert('Failed to register event: ' + err.message);
        }
      });
    } else {
      alert('Please fill in all fields');
    }
  }

  updateEvent() {
    console.log(this.selectedUserIds);
    this.updatedEvent.UserIds = this.selectedUserIds;
    this.updatedEvent.Type = +this.updatedEvent.Type;  

    this.updatedEvent.Date = new Date(this.updatedEventDateString); 

    if (this.updatedEvent.Name && this.updatedEvent.Description && this.updatedEvent.KeyWords) {
      console.log(this.updatedEvent);
      
      this.http.put<any>(`${this.apiUrl}/Update/${this.selectedEventId}`, this.updatedEvent, {
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

  deleteEvent() {
    this.http.delete<any>(`${this.apiUrl}/Delete/${this.selectedEventId}`, { 
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

  SubscribeOnEvent() {
   
  }
}

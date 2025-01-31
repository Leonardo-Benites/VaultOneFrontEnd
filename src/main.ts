import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/services/auth-interceptor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    CommonModule,
    FormsModule,
  ],
}).catch((err) => console.error(err));
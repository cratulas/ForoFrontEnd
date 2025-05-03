// src/app/pages/login/login.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mensaje: string = '';
  exito: boolean = false;

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private authService = inject(AuthService);

  onLogin() {
    this.mensaje = '';
    this.exito = false;

    if (!this.email || !this.password) {
      this.mensaje = 'Por favor, completa el correo y la contraseña.';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (respuesta: LoginResponse) => {
        this.mensaje = `Bienvenido, ${respuesta.usuario.nombreUsuario}!`;
        this.exito = true;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
        }

        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (error) => {
        this.mensaje = error?.error?.error || 'Credenciales incorrectas.';
      }
    });
  }
}

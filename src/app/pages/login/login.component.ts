import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService, Usuario } from '../../services/auth.service';

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
      next: (respuesta: Usuario) => {
        this.mensaje = `Bienvenido, ${respuesta.nombreUsuario}!`;
        this.exito = true;

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('usuario', JSON.stringify(respuesta));
        }

        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (error) => {
        this.mensaje = error?.error || 'Credenciales incorrectas.';
      }
    });
  }
}

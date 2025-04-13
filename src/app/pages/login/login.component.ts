import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

interface Usuario {
  email: string;
  password: string;
  nombre: string;
}

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
  usuarios: Usuario[] = [];

  mensaje: string = '';
  exito: boolean = false;

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  constructor() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    if (isPlatformBrowser(this.platformId)) {
      const guardados = localStorage.getItem('usuarios');
      if (guardados) {
        this.usuarios = JSON.parse(guardados);
      } else {
        this.usuarios = [
          { nombre: 'Gamer 1', email: 'gamer1@example.com', password: 'Gamer123!' },
          { nombre: 'Moderador', email: 'moderador1@example.com', password: 'Mod456@' },
          { nombre: 'Administrador', email: 'admin1@example.com', password: 'Admin789#' }
        ];
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      }
    }
  }

  onLogin() {
    this.mensaje = '';
    this.exito = false;

    if (!this.email || !this.password) {
      this.mensaje = 'Por favor, completa el correo y la contraseña.';
      return;
    }

    const usuario = this.usuarios.find(
      u => u.email === this.email && u.password === this.password
    );

    if (!usuario) {
      this.mensaje = 'Correo o contraseña incorrectos.';
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usuarioNombre', usuario.nombre);
    }

    this.mensaje = `Bienvenido, ${usuario.nombre}!`;
    this.exito = true;

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1500);
  }
}

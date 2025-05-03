import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombreUsuario: string = '';
  email: string = '';
  password: string = '';
  confirmarPassword: string = '';
  mensaje: string = '';
  exito: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onRegister() {
    this.mensaje = '';
    this.exito = false;

    if (!this.nombreUsuario || !this.email || !this.password || !this.confirmarPassword) {
      this.mensaje = 'Todos los campos son obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mensaje = 'Correo electrónico inválido.';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.validarPassword(this.password)) {
      this.mensaje = 'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.';
      return;
    }

    // Llamar al backend para registrar el usuario
    this.authService.register({
      nombreUsuario: this.nombreUsuario,
      email: this.email,
      contraseña: this.password
    }).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado exitosamente. Redirigiendo...';
        this.exito = true;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.mensaje = err.error?.message || 'Error al registrar el usuario.';
      }
    });
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }
}

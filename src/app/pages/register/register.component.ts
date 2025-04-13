import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface Usuario {
  nombre: string;
  email: string;
  password: string;
}

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

  constructor(private router: Router) {
    this.inicializarUsuariosPredefinidos();
  }

  inicializarUsuariosPredefinidos() {
    const usuariosGuardados = localStorage.getItem('usuarios');
    if (!usuariosGuardados) {
      const usuariosPredefinidos: Usuario[] = [
        { nombre: 'Gamer 1', email: 'gamer1@example.com', password: 'Gamer123!' },
        { nombre: 'Moderador', email: 'moderador1@example.com', password: 'Mod456@' },
        { nombre: 'Administrador', email: 'admin1@example.com', password: 'Admin789#' }
      ];
      localStorage.setItem('usuarios', JSON.stringify(usuariosPredefinidos));
    }
  }

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

    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.find(u => u.email === this.email);

    if (existe) {
      this.mensaje = 'Ya existe una cuenta con este correo.';
      return;
    }

    usuarios.push({
      nombre: this.nombreUsuario,
      email: this.email,
      password: this.password
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    this.mensaje = 'Usuario registrado exitosamente. Redirigiendo...';
    this.exito = true;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }
}

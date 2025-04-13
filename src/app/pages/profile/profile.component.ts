import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface UsuarioSimulado {
  email: string;
  nombre: string;
  password: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  email: string = '';
  nombre: string = '';
  password: string = '';

  mensaje: string = '';
  exito: boolean = false;

  modificarPerfil() {
    this.mensaje = '';
    this.exito = false;

    if (!this.email || !this.nombre || !this.password) {
      this.mensaje = '❌ Todos los campos son obligatorios.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.mensaje = '❌ El correo electrónico no tiene un formato válido.';
      return;
    }

    if (!this.validarPassword(this.password)) {
      this.mensaje = '❌ La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un carácter especial.';
      return;
    }

    const usuarios: UsuarioSimulado[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => u.email === this.email.trim());

    if (index === -1) {
      this.mensaje = '❌ El correo ingresado no está registrado.';
      return;
    }

    // Actualizar datos
    usuarios[index].nombre = this.nombre;
    usuarios[index].password = this.password;

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuarioNombre', this.nombre);

    this.mensaje = `✅ Perfil actualizado correctamente para ${this.email}.`;
    this.exito = true;
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }
}

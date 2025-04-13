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

  // Usuarios predefinidos
  usuarios: UsuarioSimulado[] = [
    { email: 'gamer1@example.com', password: 'pass123', nombre: 'Gamer 1' },
    { email: 'moderador1@example.com', password: 'pass456', nombre: 'Moderador' },
    { email: 'admin1@example.com', password: 'adminpass', nombre: 'Administrador' },
  ];

  modificarPerfil() {
    const usuario = this.usuarios.find(u => u.email === this.email.trim());

    if (!usuario) {
      this.mensaje = '❌ El correo ingresado no está registrado.';
      this.exito = false;
      return;
    }

    usuario.nombre = this.nombre;
    usuario.password = this.password;
    this.mensaje = `✅ Perfil actualizado correctamente para ${usuario.email}.`;
    this.exito = true;
  }
}

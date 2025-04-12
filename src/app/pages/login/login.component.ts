import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UsuarioSimulado {
  email: string;
  password: string;
  nombre: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  // Usuarios predefinidos
  usuarios: UsuarioSimulado[] = [
    { email: 'gamer1@example.com', password: 'pass123', nombre: 'Gamer 1' },
    { email: 'moderador1@example.com', password: 'pass456', nombre: 'Moderador' },
    { email: 'admin1@example.com', password: 'adminpass', nombre: 'Administrador' }
  ];

  onLogin() {
    const usuario = this.usuarios.find(u => u.email === this.email && u.password === this.password);

    if (!usuario) {
      alert('Correo o contraseña incorrectos.');
      return;
    }

    alert(`Bienvenido, ${usuario.nombre}!`);
  }
}

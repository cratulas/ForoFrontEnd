import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface UsuarioSimulado {
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

  constructor(private router: Router) {} 

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

    localStorage.setItem('usuarioNombre', usuario.nombre);
    alert(`Bienvenido, ${usuario.nombre}!`);

    this.router.navigate(['/home']);
  }
}

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
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  email: string = '';
  message: string = '';
  isSuccess: boolean = false;
  password: string = '';

  // Usuarios simulados (predefinidos)
  usuarios: UsuarioSimulado[] = [
    { email: 'gamer1@example.com', password: 'pass123', nombre: 'Gamer 1' },
    { email: 'moderador1@example.com', password: 'pass456', nombre: 'Moderador' },
    { email: 'admin1@example.com', password: 'adminpass', nombre: 'Administrador' },
  ];


  onSubmit() {
    const usuarioEncontrado = this.usuarios.find(u => u.email === this.email.trim());

    if (usuarioEncontrado) {
      this.isSuccess = true;
      this.message = `✅ Enlace enviado: Se ha enviado un correo a ${usuarioEncontrado.email} para recuperar la contraseña.`;
    } else {
      this.isSuccess = false;
      this.message = '❌ El correo ingresado no se encuentra registrado.';
    }
  }
}

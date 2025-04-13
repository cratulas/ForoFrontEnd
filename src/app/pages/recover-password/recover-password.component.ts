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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  email: string = '';
  message: string = '';
  isSuccess: boolean = false;

  onSubmit() {
    this.message = '';
    this.isSuccess = false;

    if (!this.email.trim()) {
      this.message = '❌ El campo de correo electrónico es obligatorio.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.message = '❌ El formato del correo electrónico no es válido.';
      return;
    }

    const usuarios: UsuarioSimulado[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioEncontrado = usuarios.find(u => u.email === this.email.trim());

    if (usuarioEncontrado) {
      this.isSuccess = true;
      this.message = `✅ Enlace enviado: Se ha enviado un correo a ${usuarioEncontrado.email} para recuperar la contraseña.`;
    } else {
      this.isSuccess = false;
      this.message = '❌ El correo ingresado no se encuentra registrado.';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  onRegister() {
    if (this.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    alert(`Usuario ${this.nombreUsuario} registrado exitosamente!`);
  }
}

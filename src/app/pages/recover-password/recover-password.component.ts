import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  loading: boolean = false;
  private router = inject(Router);
  
  constructor(private authService: AuthService) {}

  onSubmit() {
    this.message = '';
    this.isSuccess = false;
    this.loading = true;

    if (!this.email.trim()) {
      this.message = '❌ El campo de correo electrónico es obligatorio.';
      this.loading = false;
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.message = '❌ El formato del correo electrónico no es válido.';
      this.loading = false;
      return;
    }

    this.authService.recoverPassword(this.email).subscribe({
      next: (res) => {
        this.isSuccess = true;
        this.message = '✅ Enlace enviado: Se ha enviado un correo a ' + this.email + ' para recuperar la contraseña.';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isSuccess = false;
        this.message = err.error?.mensaje || '❌ El correo ingresado no se encuentra registrado.';
        this.loading = false;
      }
    });
  }
}


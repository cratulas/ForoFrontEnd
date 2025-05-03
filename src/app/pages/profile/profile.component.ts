import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: string = '';
  nombreUsuario: string = '';
  password: string = '';
  mensaje: string = '';
  exito: boolean = false;
  idUsuario!: number;
  rolId!: number;
  rolNombre: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const usuario: Usuario = JSON.parse(localStorage.getItem('usuario')!);
    this.email = usuario.email;
    this.nombreUsuario = usuario.nombreUsuario;
    this.idUsuario = usuario.idUsuario;
    this.rolId = usuario.rolId;
    this.rolNombre = usuario.rolNombre;
    this.email = usuario.email;
    this.nombreUsuario = usuario.nombreUsuario;
    this.idUsuario = usuario.idUsuario;
    this.rolId = usuario.rolId;
    this.rolNombre = usuario.rolNombre;
  }

  modificarPerfil() {
    this.mensaje = '';
    this.exito = false;

    if (!this.password) {
      this.mensaje = '❌ La contraseña es obligatoria.';
      return;
    }

    if (!this.validarPassword(this.password)) {
      this.mensaje = '❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.';
      return;
    }

    const datosActualizados = {
      idUsuario: this.idUsuario,
      nombreUsuario: this.nombreUsuario,
      email: this.email,                 
      contraseña: this.password,
      rol: { idRol: this.rolId }       
    };

    this.authService.actualizarUsuario(this.idUsuario, datosActualizados).subscribe({
      next: (actualizado) => {
        localStorage.setItem('usuario', JSON.stringify(actualizado));
        this.mensaje = '✅ Contraseña actualizada correctamente.';
        this.exito = true;
        setTimeout(() => this.router.navigate(['/home']), 3000);
      },
      error: () => {
        this.mensaje = '❌ Error al actualizar el perfil.';
      }
    });
  }

  validarPassword(password: string): boolean {
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
  
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  usuarioActual = 'Jugador Invitado';

  constructor(private router: Router) {}

  ngOnInit() {
    const nombre = localStorage.getItem('usuarioNombre');
    if (nombre) {
      this.usuarioActual = nombre;
    }
  }

  cerrarSesion() {
    localStorage.removeItem('usuarioNombre');
    alert('Sesión cerrada');
    this.router.navigate(['/login']);
  }
}


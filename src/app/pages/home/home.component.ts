import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForoService, Publicacion, Categoria } from '../../services/foro.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: string = '';
  busqueda: string = '';
  usuario: any = null;

  constructor(private foroService: ForoService, private router: Router) {}

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(usuarioGuardado);
    this.cargarCategorias();
    this.cargarPublicaciones();
  }

  cargarCategorias(): void {
    this.foroService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  cargarPublicaciones(): void {
    const estado = this.usuario.rolNombre === 'Administrador' || this.usuario.rolNombre === 'Moderador'
      ? ''
      : 'activo';

    this.foroService.getPublicaciones(estado).subscribe(publicaciones => {
      console.log('Publicaciones recibidas:', publicaciones);
      this.publicaciones = publicaciones;
    });
  }

  buscar(): void {
    if (this.busqueda.trim() === '') {
      this.cargarPublicaciones();
    } else {
      this.foroService.buscarPublicacionesPorTitulo(this.busqueda).subscribe(resultados => {
        this.publicaciones = resultados;
      });
    }
  }

  filtrarPorCategoria(): void {
    if (!this.categoriaSeleccionada) {
      this.cargarPublicaciones();
      return;
    }

    this.foroService.getPublicaciones().subscribe(publicaciones => {
      this.publicaciones = publicaciones.filter(
        pub => pub.categoria && pub.categoria.idCategoria == +this.categoriaSeleccionada
      );
    });
  }

  banearPublicacion(id: number): void {
    this.foroService.banearPublicacion(id).subscribe(() => {
      alert('Publicación baneada');
      this.cargarPublicaciones();
    });
  }

  eliminarPublicacion(id: number): void {
    this.foroService.eliminarPublicacion(id).subscribe(() => {
      alert('Publicación eliminada');
      this.cargarPublicaciones();
    });
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

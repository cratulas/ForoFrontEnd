// src/app/pages/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForoService, Publicacion, Categoria, Comentario } from '../../services/foro.service';

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
  comentarios: { [key: number]: Comentario[] } = {};
  nuevoComentario: { [key: number]: string } = {};
  categoriaSeleccionada: string = '';
  busqueda: string = '';
  usuario: any = null;

  nuevaPublicacion = {
    titulo: '',
    contenido: '',
    idCategoria: ''
  };

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
    const estado = this.usuario.rolNombre === 'Administrador' || this.usuario.rolNombre === 'Moderador' ? '' : 'activo';

    this.foroService.getPublicaciones(estado).subscribe(publicaciones => {
      this.publicaciones = publicaciones;
      this.publicaciones.forEach(pub => this.cargarComentarios(pub.idPublicacion));
    });
  }

  cargarComentarios(id: number): void {
    const estado = this.usuario.rolNombre === 'Administrador' || this.usuario.rolNombre === 'Moderador' ? '' : 'activo';
    this.foroService.getComentariosPorPublicacion(id, estado).subscribe(coms => {
      this.comentarios[id] = coms;
    });
  }

  buscar(): void {
    if (this.busqueda.trim() === '') {
      this.cargarPublicaciones();
    } else {
      this.foroService.buscarPublicacionesPorTitulo(this.busqueda).subscribe(resultados => {
        this.publicaciones = resultados;
        this.publicaciones.forEach(pub => this.cargarComentarios(pub.idPublicacion));
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
      this.publicaciones.forEach(pub => this.cargarComentarios(pub.idPublicacion));
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

  crearPublicacion(): void {
    const nueva = {
      titulo: this.nuevaPublicacion.titulo,
      contenido: this.nuevaPublicacion.contenido,
      idUsuario: this.usuario.idUsuario,
      categoria: { idCategoria: +this.nuevaPublicacion.idCategoria } 
    };
    

    this.foroService.crearPublicacion(nueva).subscribe(() => {
      alert('Publicación creada');
      this.nuevaPublicacion = { titulo: '', contenido: '', idCategoria: '' };
      this.cargarPublicaciones();
    });
  }

  comentar(idPublicacion: number): void {
    const contenido = this.nuevoComentario[idPublicacion];
    if (!contenido || contenido.trim() === '') return;

    const nuevo = {
      contenido,
      idUsuario: this.usuario.idUsuario,
      publicacion: { idPublicacion }  
    };
    

    this.foroService.crearComentario(nuevo).subscribe(() => {
      this.nuevoComentario[idPublicacion] = '';
      this.cargarComentarios(idPublicacion);
    });
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

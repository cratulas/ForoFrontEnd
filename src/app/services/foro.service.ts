// src/app/services/foro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
export interface Publicacion {
  idPublicacion: number;
  titulo: string;
  contenido: string;
  estado: string;
  fechaPublicacion: string;
  idUsuario: number;
  categoria: {
    idCategoria: number;
    nombreCategoria: string;
  };
}

export interface Comentario {
  idComentario: number;
  contenido: string;
  estado: string;
  fechaComentario: string;
  idUsuario: number;
  idPublicacion: number;
}

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
}

@Injectable({ providedIn: 'root' })
export class ForoService {
  private publicacionesUrl = 'http://localhost:8082/publicaciones';
  private comentariosUrl = 'http://localhost:8082/comentarios';
  private categoriasUrl = 'http://localhost:8082/categorias';

  private controlPublicacionesUrl = 'http://localhost:8083/control/publicaciones';
  private controlComentariosUrl = 'http://localhost:8083/control/comentarios';

  constructor(private http: HttpClient) {}

  // Publicaciones
  getPublicaciones(estado: string = ''): Observable<Publicacion[]> {
    const url = estado ? `${this.publicacionesUrl}?estado=${estado}` : this.publicacionesUrl;
    return this.http.get<Publicacion[]>(url);
  }

  buscarPublicacionesPorTitulo(titulo: string): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.publicacionesUrl}/buscar?titulo=${titulo}`);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }

  // Comentarios
  getComentariosPorPublicacion(id: number, estado?: string): Observable<Comentario[]> {
    const url = estado
      ? `${this.comentariosUrl}/publicacion/${id}?estado=${estado}`
      : `${this.comentariosUrl}/publicacion/${id}`;
    return this.http.get<Comentario[]>(url);
  }

  // Control: solo para moderadores/admins
  banearPublicacion(id: number): Observable<any> {
    return this.http.put(`${this.controlPublicacionesUrl}/${id}/banear`, {});
  }

  eliminarPublicacion(id: number): Observable<any> {
    return this.http.delete(`${this.controlPublicacionesUrl}/${id}`);
  }

  banearComentario(id: number): Observable<any> {
    return this.http.put(`${this.controlComentariosUrl}/${id}/banear`, {});
  }

  eliminarComentario(id: number): Observable<any> {
    return this.http.delete(`${this.controlComentariosUrl}/${id}`);
  }
}

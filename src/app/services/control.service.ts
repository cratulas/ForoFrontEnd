import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({ providedIn: 'root' })
export class ControlService {
  private publicacionesUrl = `${environment.apiControl}/publicaciones`;
  private comentariosUrl = `${environment.apiControl}/comentarios`;



  constructor(private http: HttpClient) {}

  // Publicaciones
  banearPublicacion(id: number): Observable<any> {
    return this.http.put(`${this.publicacionesUrl}/${id}/banear`, {});
  }

  desbanearPublicacion(id: number): Observable<any> {
    return this.http.put(`${this.publicacionesUrl}/${id}/desbanear`, {});
  }

  toggleBanearPublicacion(id: number, estadoActual: string): Observable<any> {
    return estadoActual === 'baneada'
      ? this.desbanearPublicacion(id)
      : this.banearPublicacion(id);
  }

  eliminarPublicacion(id: number): Observable<any> {
    return this.http.delete(`${this.publicacionesUrl}/${id}`);
  }

  // Comentarios
  banearComentario(id: number): Observable<any> {
    return this.http.put(`${this.comentariosUrl}/${id}/banear`, {});
  }

  desbanearComentario(id: number): Observable<any> {
    return this.http.put(`${this.comentariosUrl}/${id}/desbanear`, {});
  }

  toggleBanearComentario(id: number, estadoActual: string): Observable<any> {
    return estadoActual === 'baneada'
      ? this.desbanearComentario(id)
      : this.banearComentario(id);
  }

  eliminarComentario(id: number): Observable<any> {
    return this.http.delete(`${this.comentariosUrl}/${id}`);
  }
}

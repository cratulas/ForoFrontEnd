// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  rolId: number;
  rolNombre: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUsuarios;

  constructor(private http: HttpClient) {}

  login(email: string, contraseña: string): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('email', email)
      .set('contraseña', contraseña);

    return this.http.post<LoginResponse>(this.baseUrl + '/login', null, { params });
  }

  register(data: { nombreUsuario: string, email: string, contraseña: string }): Observable<any> {
    const payload = {
      ...data,
      rol: { idRol: 1 }
    };
    return this.http.post(this.baseUrl, payload);
  }

  recoverPassword(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.post(`${this.baseUrl}/recover-password`, null, { params });
  }

  actualizarUsuario(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }
  
  
}

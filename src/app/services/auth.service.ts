// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  rolId: number;
  rolNombre: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8081/usuarios';

  constructor(private http: HttpClient) {}

  login(email: string, contraseña: string): Observable<Usuario> {
    const params = new HttpParams()
      .set('email', email)
      .set('contraseña', contraseña);
    return this.http.post<Usuario>(this.baseUrl + '/login', null, { params });
  }
}

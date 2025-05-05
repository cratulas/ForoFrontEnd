// src/app/services/foro.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ForoService, Publicacion, Categoria, Comentario } from './foro.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ForoService', () => {
  let service: ForoService;
  let http: HttpTestingController;
  const base = 'http://localhost:8082';
  const fechaIso = new Date().toISOString();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForoService],
    });
    service = TestBed.inject(ForoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getCategorias debería hacer GET /categorias', () => {
    const mock: Categoria[] = [{ idCategoria: 1, nombreCategoria: 'X' }];
    let result: Categoria[]|undefined;

    service.getCategorias().subscribe(data => result = data);
    const req = http.expectOne(`${base}/categorias`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(result).toEqual(mock);
  });

  it('getPublicaciones debería usar query param estado', () => {
    const mock: Publicacion[] = [{
      idPublicacion: 1,
      titulo: 'T',
      contenido: 'C',
      estado: 'activo',
      idUsuario: 1,
      categoria: { idCategoria: 1, nombreCategoria: 'X' },
      fechaPublicacion: fechaIso
    }];
    let result: Publicacion[]|undefined;

    service.getPublicaciones('activo').subscribe(data => result = data);
    const req = http.expectOne(`${base}/publicaciones?estado=activo`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(result).toEqual(mock);
  });

  it('getComentariosPorPublicacion debería usar ruta correcta', () => {
    const mock: Comentario[] = [];
    let result: Comentario[]|undefined;

    service.getComentariosPorPublicacion(1, '').subscribe(data => result = data);
    const req = http.expectOne(`${base}/comentarios/publicacion/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(result).toEqual(mock);
  });

  it('buscarPublicacionesPorTitulo debería hacer GET /publicaciones/buscar?titulo=foo', () => {
    const mock: Publicacion[] = [{
      idPublicacion: 2,
      titulo: 'Foo',
      contenido: 'Bar',
      estado: 'activo',
      idUsuario: 1,
      categoria: { idCategoria: 1, nombreCategoria: 'X' },
      fechaPublicacion: fechaIso
    }];
    let result: Publicacion[]|undefined;

    service.buscarPublicacionesPorTitulo('foo').subscribe(data => result = data);
    const req = http.expectOne(`${base}/publicaciones/buscar?titulo=foo`);
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(result).toEqual(mock);
  });
});

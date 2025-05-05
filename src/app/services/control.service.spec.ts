// src/app/services/control.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { ControlService } from './control.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ControlService', () => {
  let service: ControlService;
  let http: HttpTestingController;
  const base = 'http://localhost:8083/control';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ControlService]
    });
    service = TestBed.inject(ControlService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('toggleBanearPublicacion hace PUT /publicaciones/:id/banear', () => {
    let called = false;
    service.toggleBanearPublicacion(1, 'activo').subscribe(res => {
      called = true;
      expect(res).toEqual({ ok: true });
    });

    const req = http.expectOne(`${base}/publicaciones/1/banear`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ok: true });

    expect(called).toBeTrue();
  });

  it('eliminarPublicacion hace DELETE /publicaciones/:id', () => {
    let called = false;
    service.eliminarPublicacion(1).subscribe(() => called = true);

    const req = http.expectOne(`${base}/publicaciones/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(called).toBeTrue();
  });

  it('toggleBanearComentario hace PUT /comentarios/:id/banear', () => {
    let called = false;
    service.toggleBanearComentario(2, 'activo').subscribe(res => {
      called = true;
      expect(res).toEqual({ ok: true });
    });
  
    const req = http.expectOne(`${base}/comentarios/2/banear`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ok: true });
  
    expect(called).toBeTrue();
  });
  

  it('eliminarComentario hace DELETE /comentarios/:id', () => {
    let called = false;
    service.eliminarComentario(2).subscribe(() => called = true);

    const req = http.expectOne(`${base}/comentarios/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(called).toBeTrue();
  });
});

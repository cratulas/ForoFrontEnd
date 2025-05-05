import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ForoService, Publicacion, Categoria, Comentario } from '../../services/foro.service';
import { ControlService } from '../../services/control.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let foroService: jasmine.SpyObj<ForoService>;
  let controlService: jasmine.SpyObj<ControlService>;
  let router: Router;
  const fechaIso = new Date().toISOString();

  beforeEach(async () => {
    const foroSpy = jasmine.createSpyObj('ForoService', [
      'getCategorias',
      'getPublicaciones',
      'getComentariosPorPublicacion',
      'buscarPublicacionesPorTitulo',
      'crearPublicacion',
      'crearComentario'
    ]);
    const controlSpy = jasmine.createSpyObj('ControlService', [
      'toggleBanearPublicacion',
      'eliminarPublicacion',
      'toggleBanearComentario',
      'eliminarComentario'
    ]);


    const mockCat: Categoria[] = [{ idCategoria: 1, nombreCategoria: 'Cat1' }];
    foroSpy.getCategorias.and.returnValue(of(mockCat));

    const mockPub: Publicacion[] = [{
      idPublicacion: 1,
      estado: 'activo',
      titulo: 'T',
      contenido: 'C',
      idUsuario: 1,
      categoria: { idCategoria: 1, nombreCategoria: 'Cat1' },
      fechaPublicacion: fechaIso
    }];
    foroSpy.getPublicaciones.and.returnValue(of(mockPub));
    foroSpy.getComentariosPorPublicacion.and.returnValue(of([]));
    foroSpy.buscarPublicacionesPorTitulo.and.returnValue(of(mockPub));
    foroSpy.crearPublicacion.and.returnValue(of(undefined));
    foroSpy.crearComentario.and.returnValue(of(undefined));

    controlSpy.toggleBanearPublicacion.and.returnValue(of(undefined));
    controlSpy.eliminarPublicacion.and.returnValue(of(undefined));
    controlSpy.toggleBanearComentario.and.returnValue(of(undefined));
    controlSpy.eliminarComentario.and.returnValue(of(undefined));

    spyOn(window, 'alert');
    localStorage.setItem('usuario', JSON.stringify({ idUsuario: 1, rolNombre: 'Jugador' }));

    await TestBed.configureTestingModule({
      imports: [ HomeComponent, HttpClientTestingModule, RouterTestingModule ],
      providers: [
        { provide: ForoService, useValue: foroSpy },
        { provide: ControlService, useValue: controlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    foroService    = TestBed.inject(ForoService)    as jasmine.SpyObj<ForoService>;
    controlService = TestBed.inject(ControlService) as jasmine.SpyObj<ControlService>;
    router         = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.removeItem('usuario'));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit llama a cargar categorías y publicaciones', () => {
    expect(foroService.getCategorias).toHaveBeenCalled();
    expect(foroService.getPublicaciones).toHaveBeenCalled();
    expect(component.categorias.length).toBe(1);
    expect(component.publicaciones.length).toBe(1);
  });

  it('buscar("") recarga publicaciones', () => {
    component.busqueda = '';
    component.buscar();
    expect(foroService.getPublicaciones).toHaveBeenCalledTimes(2);
  });

  it('buscar texto no vacío llama al método de búsqueda', () => {
    component.busqueda = 'foo';
    component.buscar();
    expect(foroService.buscarPublicacionesPorTitulo).toHaveBeenCalledWith('foo');
  });

  it('filtrarPorCategoria vacía recarga publicaciones', () => {
    component.categoriaSeleccionada = '';
    component.filtrarPorCategoria();
    expect(foroService.getPublicaciones).toHaveBeenCalled();
  });

  it('filtrarPorCategoria con valor filtra correctamente', () => {
    component.categoriaSeleccionada = '1';
    const pubs: Publicacion[] = [
      {
        idPublicacion: 1, estado: 'activo', titulo: '', contenido: '',
        idUsuario: 1, categoria: { idCategoria: 2, nombreCategoria: 'X' },
        fechaPublicacion: fechaIso
      },
      {
        idPublicacion: 2, estado: 'activo', titulo: '', contenido: '',
        idUsuario: 1, categoria: { idCategoria: 1, nombreCategoria: 'Cat1' },
        fechaPublicacion: fechaIso
      }
    ];
    foroService.getPublicaciones.and.returnValue(of(pubs));
    component.filtrarPorCategoria();
    expect(component.publicaciones.every(p => p.categoria.idCategoria === 1)).toBeTrue();
  });

  it('esModerador/esAdmin detectan roles', () => {
    expect(component.esModerador()).toBeFalse();
    expect(component.esAdmin()).toBeFalse();
    component.usuario.rolNombre = 'Maestro del foro';
    expect(component.esModerador()).toBeTrue();
    component.usuario.rolNombre = 'Game Master';
    expect(component.esAdmin()).toBeTrue();
  });

  it('toggleBanearPublicacion invoca servicio y actualiza estado', () => {
    const pub = component.publicaciones[0];
    pub.estado = 'activo';
    component.toggleBanearPublicacion(pub);
    expect(controlService.toggleBanearPublicacion).toHaveBeenCalledWith(pub.idPublicacion, 'activo');
    expect(pub.estado).toBe('baneada');
  });

  it('eliminarPublicacion invoca servicio', () => {
    component.eliminarPublicacion(1);
    expect(controlService.eliminarPublicacion).toHaveBeenCalledWith(1);
  });

  it('toggleBanearComentario invoca servicio y actualiza estado', () => {
    const com: Comentario = {
      idComentario: 5, contenido: 'x', estado: 'activo',
      idUsuario: 1, idPublicacion: 1, fechaComentario: fechaIso
    };
    component.toggleBanearComentario(com);
    expect(controlService.toggleBanearComentario).toHaveBeenCalledWith(com.idComentario, 'activo');
    expect(com.estado).toBe('baneada');
  });

  it('eliminarComentario invoca servicio', () => {
    component.eliminarComentario(5);
    expect(controlService.eliminarComentario).toHaveBeenCalledWith(5);
  });

  it('crearPublicacion invoca servicio y resetea modelo', () => {
    component.nuevaPublicacion = { titulo: 'T', contenido: 'C', idCategoria: '1' };
    component.crearPublicacion();
    expect(foroService.crearPublicacion).toHaveBeenCalled();
    expect(component.nuevaPublicacion.titulo).toBe('');
  });

  it('comentar con texto invoca servicio', () => {
    component.nuevoComentario[1] = 'hola';
    component.comentar(1);
    expect(foroService.crearComentario).toHaveBeenCalled();
  });

  it('cerrarSesion limpia storage y navega', fakeAsync(() => {
    const navSpy = spyOn(router, 'navigate');
    component.cerrarSesion();
    tick();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  }));
});

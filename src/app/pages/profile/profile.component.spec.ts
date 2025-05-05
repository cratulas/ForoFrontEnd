import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService, Usuario } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('ProfileComponent', () => {
  let comp: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let auth: jasmine.SpyObj<AuthService>;
  let router: Router;
  const mockUser: Usuario = {
    idUsuario: 1,
    nombreUsuario: 'U',
    email: 'u@u.u',
    rolId: 2,
    rolNombre: 'X'
  };

  beforeEach(async () => {
    auth = jasmine.createSpyObj('AuthService', ['actualizarUsuario']);
    localStorage.setItem('usuario', JSON.stringify(mockUser));
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: auth }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges(); // ngOnInit
  });

  afterEach(() => localStorage.removeItem('usuario'));

  it('should create and cargar datos', () => {
    expect(comp.email).toBe(mockUser.email);
  });

  it('modificarPerfil() sin contraseña', () => {
    comp.password = '';
    comp.modificarPerfil();
    expect(comp.mensaje).toContain('La contraseña es obligatoria');
  });

  it('modificarPerfil() contraseña inválida', () => {
    comp.password = 'weak';
    comp.modificarPerfil();
    expect(comp.mensaje).toContain('La contraseña debe tener al menos 8 caracteres');
  });

  it('modificarPerfil() éxito', fakeAsync(() => {
    const updated = { ...mockUser, email: 'x@x.x' };
    auth.actualizarUsuario.and.returnValue(of(updated));
    const navSpy = spyOn(router, 'navigate');
    comp.password = 'Abc123!@';
    comp.modificarPerfil();
    tick(3000);
    expect(comp.exito).toBeTrue();
    expect(navSpy).toHaveBeenCalledWith(['/home']);
  }));

  it('modificarPerfil() error', () => {
    auth.actualizarUsuario.and.returnValue(throwError({}));
    comp.password = 'Abc123!@';
    comp.modificarPerfil();
    expect(comp.mensaje).toContain('Error al actualizar el perfil');
  });

  it('cerrarSesion() limpia storage y navega', () => {
    const navSpy = spyOn(router, 'navigate');
    comp.cerrarSesion();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  });

  it('ngOnInit() no revienta si usuario no existe en localStorage', () => {
    localStorage.removeItem('usuario');
    expect(() => comp.ngOnInit()).toThrow(); 
  });
  
  it('validarPassword() valida correctamente distintas contraseñas', () => {
    expect(comp.validarPassword('Abc123!@')).toBeTrue();   
    expect(comp.validarPassword('abc123!@')).toBeFalse();  
    expect(comp.validarPassword('ABC123!@')).toBeFalse();  
    expect(comp.validarPassword('Abcdefgh')).toBeFalse(); 
    expect(comp.validarPassword('Abc!@#$%')).toBeFalse();  
    expect(comp.validarPassword('12345678')).toBeFalse();
  });
  
  
});

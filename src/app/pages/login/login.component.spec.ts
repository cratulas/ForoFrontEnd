import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let comp: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    auth = jasmine.createSpyObj('AuthService', ['login']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: auth }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    comp = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('onLogin() sin credenciales muestra mensaje', () => {
    comp.email = '';
    comp.password = '';
    comp.onLogin();
    expect(comp.mensaje).toBe('Por favor, completa el correo y la contraseña.');
  });

  it('onLogin() éxito llama a AuthService y navega', fakeAsync(() => {
    const fakeResp: LoginResponse = {
      token: 'tk',
      usuario: { nombreUsuario: 'U', idUsuario: 1, rolNombre: 'X' } as any
    };
    auth.login.and.returnValue(of(fakeResp));
    const navSpy = spyOn(router, 'navigate');
    comp.email = 'a@b.c';
    comp.password = 'P4ssw0rd!';
    comp.onLogin();

    tick(1500);

    expect(comp.exito).toBeTrue();
    expect(comp.mensaje).toContain('Bienvenido');
    expect(navSpy).toHaveBeenCalledWith(['/home']);
  }));

  it('onLogin() error del servicio muestra mensaje de error', () => {
    auth.login.and.returnValue(throwError({ error: { error: 'Bad creds' } }));
    comp.email = 'a@b.c';
    comp.password = '123';
    comp.onLogin();
    expect(comp.mensaje).toBe('Bad creds');
  });
});

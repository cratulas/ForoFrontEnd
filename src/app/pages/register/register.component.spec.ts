import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('onRegister() campos vacíos muestra error', () => {
    component.onRegister();
    expect(component.mensaje).toBe('Todos los campos son obligatorios.');
  });

  it('onRegister() email inválido muestra error', () => {
    component.nombreUsuario = 'u';
    component.email = 'no-email';
    component.password = 'Pass123!';
    component.confirmarPassword = 'Pass123!';
    component.onRegister();
    expect(component.mensaje).toBe('Correo electrónico inválido.');
  });

  it('onRegister() contraseñas no coinciden muestra error', () => {
    component.nombreUsuario = 'u';
    component.email = 'u@u.com';
    component.password = 'Pass123!';
    component.confirmarPassword = 'Other123!';
    component.onRegister();
    expect(component.mensaje).toBe('Las contraseñas no coinciden.');
  });

  it('onRegister() contraseña débil muestra error', () => {
    component.nombreUsuario = 'u';
    component.email = 'u@u.com';
    component.password = 'weak';
    component.confirmarPassword = 'weak';
    component.onRegister();
    expect(component.mensaje).toContain('La contraseña debe tener mínimo 8 caracteres');
  });

  it('onRegister() éxito navega a /login', fakeAsync(() => {
    authService.register.and.returnValue(of({}));
    const navSpy = spyOn(router, 'navigate');
    component.nombreUsuario = 'u';
    component.email = 'u@u.com';
    component.password = 'Pass123!';
    component.confirmarPassword = 'Pass123!';
    component.onRegister();
    expect(component.exito).toBeTrue();
    tick(1500);
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  }));

  it('onRegister() error del servicio muestra mensaje', () => {
    authService.register.and.returnValue(throwError(() => ({ error: { message: 'Fail' } })));
    component.nombreUsuario = 'u';
    component.email = 'u@u.com';
    component.password = 'Pass123!';
    component.confirmarPassword = 'Pass123!';
    component.onRegister();
    expect(component.mensaje).toBe('Fail');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    // Simular el objeto usuario en localStorage
    const mockUsuario = {
      email: 'test@example.com',
      nombreUsuario: 'TestUser',
      idUsuario: 1,
      rolId: 2,
      rolNombre: 'Jugador'
    };
    localStorage.setItem('usuario', JSON.stringify(mockUsuario));

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('usuario');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

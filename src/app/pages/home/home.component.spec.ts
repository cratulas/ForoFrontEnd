import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    // Simular el objeto usuario en localStorage
    const mockUsuario = {
      idUsuario: 1,
      rolNombre: 'Jugador'
    };
    localStorage.setItem('usuario', JSON.stringify(mockUsuario));

    await TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertasNotificacionesComponent } from './alertas-notificaciones.component';

describe('AlertasNotificacionesComponent', () => {
  let component: AlertasNotificacionesComponent;
  let fixture: ComponentFixture<AlertasNotificacionesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlertasNotificacionesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertasNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

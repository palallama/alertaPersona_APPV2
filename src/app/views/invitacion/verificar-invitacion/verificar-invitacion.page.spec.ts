import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarInvitacionPage } from './verificar-invitacion.page';

describe('VerificarInvitacionPage', () => {
  let component: VerificarInvitacionPage;
  let fixture: ComponentFixture<VerificarInvitacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarInvitacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

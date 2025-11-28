import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmitAlertPage } from './emit-alert.page';

describe('EmitAlertPage', () => {
  let component: EmitAlertPage;
  let fixture: ComponentFixture<EmitAlertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

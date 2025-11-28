import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssistAlertPage } from './assist-alert.page';

describe('AssistAlertPage', () => {
  let component: AssistAlertPage;
  let fixture: ComponentFixture<AssistAlertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

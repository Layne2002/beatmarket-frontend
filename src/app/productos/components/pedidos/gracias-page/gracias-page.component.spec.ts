import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraciasPageComponent } from './gracias-page.component';

describe('GraciasPageComponent', () => {
  let component: GraciasPageComponent;
  let fixture: ComponentFixture<GraciasPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraciasPageComponent]
    });
    fixture = TestBed.createComponent(GraciasPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

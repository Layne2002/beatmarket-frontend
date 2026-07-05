import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionStockPageComponent } from './gestion-stock-page.component';

describe('GestionStockPageComponent', () => {
  let component: GestionStockPageComponent;
  let fixture: ComponentFixture<GestionStockPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestionStockPageComponent]
    });
    fixture = TestBed.createComponent(GestionStockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

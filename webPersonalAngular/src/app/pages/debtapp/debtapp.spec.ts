import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Debtapp } from './debtapp';

describe('Debtapp', () => {
  let component: Debtapp;
  let fixture: ComponentFixture<Debtapp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Debtapp],
    }).compileComponents();

    fixture = TestBed.createComponent(Debtapp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

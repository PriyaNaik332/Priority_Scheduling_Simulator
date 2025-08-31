import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nonpreemptive } from './nonpreemptive';

describe('Nonpreemptive', () => {
  let component: Nonpreemptive;
  let fixture: ComponentFixture<Nonpreemptive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nonpreemptive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nonpreemptive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

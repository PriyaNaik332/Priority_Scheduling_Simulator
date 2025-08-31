import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Preemptive } from './preemptive';

describe('Preemptive', () => {
  let component: Preemptive;
  let fixture: ComponentFixture<Preemptive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Preemptive]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Preemptive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

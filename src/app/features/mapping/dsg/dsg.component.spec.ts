import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsgComponent } from './dsg.component';

describe('DsgComponent', () => {
  let component: DsgComponent;
  let fixture: ComponentFixture<DsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

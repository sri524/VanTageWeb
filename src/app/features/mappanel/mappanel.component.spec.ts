import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappanelComponent } from './mappanel.component';

describe('MappanelComponent', () => {
  let component: MappanelComponent;
  let fixture: ComponentFixture<MappanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MappanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MappanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

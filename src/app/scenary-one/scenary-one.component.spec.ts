import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenaryOneComponent } from './scenary-one.component';

describe('ScenaryOneComponent', () => {
  let component: ScenaryOneComponent;
  let fixture: ComponentFixture<ScenaryOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScenaryOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScenaryOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

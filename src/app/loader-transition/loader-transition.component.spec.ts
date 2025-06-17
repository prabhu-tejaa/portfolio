import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderTransitionComponent } from './loader-transition.component';

describe('LoaderTransitionComponent', () => {
  let component: LoaderTransitionComponent;
  let fixture: ComponentFixture<LoaderTransitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoaderTransitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoaderTransitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

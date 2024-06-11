import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonFiguresComponent } from './comparison-figures.component';

describe('ComparisonFiguresComponent', () => {
  let component: ComparisonFiguresComponent;
  let fixture: ComponentFixture<ComparisonFiguresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonFiguresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComparisonFiguresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

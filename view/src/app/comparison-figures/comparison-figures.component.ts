import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comparison-figures',
  standalone: true,
  imports: [],
  templateUrl: './comparison-figures.component.html',
  styleUrl: './comparison-figures.component.less'
})
export class ComparisonFiguresComponent {
  constructor() {
    this.caption1 = 'Figure 1';
    this.caption2 = 'Figure 2';
    this.numRankedPairs = 1;
    this.totalPairs = 50;
  }
  @Input() caption1: string;
  @Input() caption2: string;
  @Input() numRankedPairs: number;
  @Input() totalPairs: number;


  handleClick1() {
  }

  handleClick2() {
  }
}

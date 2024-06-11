import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TodoService } from './api.service';

import { ComparisonFiguresComponent } from './comparison-figures/comparison-figures.component';
import { TodoListComponent } from './todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ComparisonFiguresComponent, TodoListComponent,
    HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [
    TodoService,
  ],
})

export class AppComponent { }

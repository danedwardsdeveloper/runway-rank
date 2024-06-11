import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from '../api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.less',
  imports: [CommonModule]
})

export class TodoListComponent implements OnInit {

  todos: Todo[] = [];

  constructor(private todoService: TodoService) { }

  // fetchTodos() {
  //   this.todoService.getTodos()
  //     .subscribe(data => {
  //       this.todos = data;
  //       console.log('Fetched todos:', data);
  //     });
  // }

  ngOnInit() {
    this.todoService.getTodos()
      .subscribe(data => {
        this.todos = data;
        console.log('Fetched todos:', data);
      });
  }

  fetchTodos() {
    this.todoService.getTodos()
      .subscribe(data => this.todos = data as Todo[]);
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { tap, map, catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:8000/api/todos';

export interface Todo {
  todo_id: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  constructor(private http: HttpClient) { }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(API_URL);
  }
}
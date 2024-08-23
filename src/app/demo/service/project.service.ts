import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ProjectDto} from "../dto/project-dto";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private baseUrl = 'http://localhost:8081/solution-service/api/solutions';

    constructor(private http: HttpClient) { }

    getAllSolutions(): Observable<ProjectDto[]> {
        return this.http.get<ProjectDto[]>(`${this.baseUrl}/all`);
    }
    createSolution(formData: FormData): Observable<any> {
        return this.http.post(this.baseUrl, formData);
    }
    deleteSolution(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}

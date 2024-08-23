import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
    private baseUrl = 'http://localhost:8081';
    private projectCountUrl = '/project-service/projects/count';
    private contactCountUrl = '/auth-service/api/contacts/count';
    private solutionCountUrl = '/solution-service/api/solutions/count';
    private userCountUrl = '/auth-service/count';

    constructor(private http: HttpClient) { }

    getProjectCount(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}${this.projectCountUrl}`);
    }

    getContactCount(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}${this.contactCountUrl}`);
    }

    getSolutionCount(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}${this.solutionCountUrl}`);
    }

    getUserCount(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}${this.userCountUrl}`);
    }
}

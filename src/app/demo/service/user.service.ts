import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Utilisateur} from "../dto/utilisateur";
import {ManagerDTO} from "../dto/manager-dto";



@Injectable({
  providedIn: 'root'
})
export class UserService {

    private baseUrl = 'http://localhost:8081/auth-service/api/users';
    private baseUrl2 = 'http://localhost:8081/auth-service';
    private currentUserSubject: BehaviorSubject<Utilisateur>;

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        const initialUser = storedUser ? JSON.parse(storedUser) : null;
        this.currentUserSubject = new BehaviorSubject<Utilisateur>(initialUser);
    }

    public get currentUserValue(): Utilisateur {
        return this.currentUserSubject.value;
    }

    getUserById(id: number): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${this.baseUrl}/${id}`);
    }

    setUser(user: Utilisateur): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    clearUser(): void {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next({} as Utilisateur);
    }

    get currentUser(): Observable<Utilisateur> {
        return this.currentUserSubject.asObservable();
    }
    getAllProjectManagers(): Observable<Utilisateur[]> {
        const url = `${this.baseUrl2}/project-managers`;
        return this.http.get<Utilisateur[]>(url);
    }

    getAllUsers(): Observable<Utilisateur[]> {
        const url = `${this.baseUrl2}/users`;
        return this.http.get<Utilisateur[]>(url);
    }
    registerProjectManager(managerData: ManagerDTO): Observable<any> {
        return this.http.post(`${this.baseUrl2}/register/project-manager`, managerData);
    }
    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.baseUrl2}/${userId}`, { observe: 'response' });
    }
}

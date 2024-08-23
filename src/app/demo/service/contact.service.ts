import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Contact} from "../dto/contact";

@Injectable({
  providedIn: 'root'
})
export class ContactService {

    private baseUrl = 'http://localhost:8081/auth-service/api/contacts';

    constructor(private http: HttpClient) { }

    getAllContacts(): Observable<Contact[]> {
        return this.http.get<Contact[]>(`${this.baseUrl}/all`);
    }
    createContact(formData: FormData): Observable<any> {
        return this.http.post(`${this.baseUrl}/createOrUpdate`, formData);
    }
    deleteContact(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}

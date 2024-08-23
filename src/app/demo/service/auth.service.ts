import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {LoginDTO} from "../dto/login-dto";
import {UserService} from "./user.service";
import {Utilisateur} from "../dto/utilisateur";

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {


    isLoggedInSubject: BehaviorSubject<boolean> ;
    email: string;

    constructor(private http: HttpClient, private router: Router,private userService:UserService) {
        this.email = localStorage.getItem('email') || '';
        const isLogged = this.isLoggedIn();
        this.isLoggedInSubject= new BehaviorSubject<boolean>(isLogged);
    }

    login(loginDTO: LoginDTO): Observable<LoginDTO> {
        return this.http
            .post<LoginDTO>(
                `http://localhost:8081/auth-service/admin/login`,
                loginDTO,
                httpOptions
            )
            .pipe(
                tap(async (res: any) => {
                    this.storeToken(res.accessToken);
                    this.router.navigateByUrl('/');
                    this.isLoggedInSubject.next(true);
                    this.getUserById(res.userId);
                })
            );
    }
    private getUserById(id: number) {
        this.userService.getUserById(id).subscribe(
            (user:Utilisateur) => {
                this.userService.setUser(user); // Store user in the service
                console.log(user); // Do something with the user data
            },
            (error) => {
                console.error(error);
            }
        );
    }

    storeToken(token: any) {
        sessionStorage.setItem('token', token);
    }
    // register(userDTO: RegisterDto): Observable<UserDTO> {
    //     return this.http
    //         .post<RegisterDto>(
    //             `http://localhost:8081/auth-service/api/auth/register`,
    //             userDTO,
    //             httpOptions
    //         )
    //         .pipe(
    //             tap(async (res: any) => {
    //                 console.log('response =>', res);
    //                 // this.isLogged=true;
    //             })
    //         );
    // }
    //
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    get isLoggedIn$(): Observable<boolean> {
        return this.isLoggedInSubject.asObservable();
    }
    //
    getToken() {
        return sessionStorage.getItem('token');
    }
    //
    logout() {
        sessionStorage.clear();
        this.router.navigateByUrl('/auth/login');
    }
    //
    // sendMailIfUserExists(userDTO: UserDTO): Observable<EmailDTO> {
    //     console.log('in');
    //     return this.http
    //         .post<EmailDTO>(
    //             `http://localhost:8081/auth-service/exists`,
    //             userDTO,
    //             httpOptions
    //         )
    //         .pipe(
    //             tap(async (res: any) => {}),
    //             catchError((error: any) => {
    //                 console.error('An error occurred:', error);
    //                 return throwError(error);
    //             })
    //         );
    // }
    //
    // resetPassword(passwordResetDTO: PasswordResetDTO): Observable<any> {
    //     return this.http
    //         .post<any>(
    //             `http://localhost:8081/auth-service/password/reset`,
    //             passwordResetDTO,
    //             httpOptions
    //         );
    // }

    //
    // setEmail(mail: string) {
    //     localStorage.setItem('email', mail);
    //     this.email = mail;
    //     console.log('email in set method ', this.email);
    // }
    //
    // getEmail() {
    //     console.log('email in get', localStorage.getItem('email'));
    //
    //     return localStorage.getItem('email') || '';
    // }

}

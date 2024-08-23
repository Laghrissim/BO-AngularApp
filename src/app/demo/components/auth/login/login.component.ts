import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];

    password!: string;
    email: string = '';

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {}

    login() {
        const loginDTO = { email: this.email, password: this.password };
        this.authService.login(loginDTO).subscribe(
            () => {
                this.router.navigateByUrl('/');
            },
            (error) => {
                console.error('Login failed:', error);
            }
        );
    }
}

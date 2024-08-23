import {CanActivate, CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./demo/service/auth.service";
import {Injectable} from "@angular/core";
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        if (this.authService.isLoggedIn()) {
            return true; // User is logged in, allow access
        } else {
            this.router.navigate(['/auth/login']); // Redirect to the login page
            return false; // Deny access
        }
    }
}

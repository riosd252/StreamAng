import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthData } from './auth-data';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError, tap, catchError } from 'rxjs'; // Il BehaviourSubject è un tipo particolare di Observable che richiede un valore iniziale, emette in tempo reale il cambiamento di valore e si desottoscrive DA SOLO immediatamente dopo - L'operatore tap è utilizzato per manipolare il PRIMO valore emesso da una chiamata HTTP
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    jwtHelper = new JwtHelperService();
    apiURL = environment.apiURL;
    // Elementi per gestire il flusso utente
    private authSubj = new BehaviorSubject<null | AuthData>(null);
    user$ = this.authSubj.asObservable(); // La variabile di tipo BehaviourSubject che trasmette la presenza o meno dell'utente
    utente!: AuthData;

    constructor(private http: HttpClient, private router: Router) {}

    login(data: { email: string; password: string }) {
        return this.http.post<AuthData>(`${this.apiURL}/login`, data).pipe(
            tap((logged) => {
                this.authSubj.next(logged);
                this.utente = logged;

                localStorage.setItem('user', JSON.stringify(logged));
                this.router.navigate(['/movies']);
            })
        );
    }

    restore() {
        // Utilizzato nel caso in cui l'utente abbandoni l'applicazione senza fare logout; se rientra e il token è ancora valido, non dovrà rifare login
        const user = localStorage.getItem('user');
        if (!user) {
            this.router.navigate(['/']);
            return;
        }
        const userData: AuthData = JSON.parse(user);
        if (this.jwtHelper.isTokenExpired(userData.accessToken)) {
            this.router.navigate(['/login']);
            return;
        }
        this.authSubj.next(userData); // Rientrando nell'applicazione dopo essere usciti, il BehaviourSubject è di nuovo null: in questo modo riceve i valori presenti nel localStorage e comunica di nuovo a user$ la presenza dell'utente
    }

    register(data: {
        nome: string;
        cognome: string;
        email: string;
        password: string;
    }) {
        return this.http.post(`${this.apiURL}/register`, data).pipe(
            tap(() => {
                this.router.navigate(['/login']);
            })
        );
    }

    logout() {
        this.authSubj.next(null);
        localStorage.removeItem('user');
        this.router.navigate(['/']);
    }
}

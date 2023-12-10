import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Movie } from '../models/movie';

@Injectable({
    providedIn: 'root',
})
export class MovieService {
    apiURL = environment.apiURL;

    constructor(private http: HttpClient) {}

    getPopular() {
        return this.http.get<Movie[]>(`${this.apiURL}/movies-popular`);
    }

    getTopRated() {
        return this.http.get<Movie[]>(`${this.apiURL}/movies-toprated`);
    }

    getFavorites() {
        return this.http.get<Movie[]>(`${this.apiURL}/favorites`);
    }

    addFav(data: Movie) {
        this.getFavorites().subscribe((favMov: Movie[]) => {
            const targetId = data.id;
            const favorites: Movie[] = favMov;
            let userFavs: Movie[] = favorites.filter(
                (movie) => movie.userId === data.userId
            );

            const isObjPresent = userFavs.some((mov) => mov.id === targetId);
            if (isObjPresent) {
                return alert('The selected movie is already a favorite.');
            } else {
                this.http
                    .post<Movie>(`${this.apiURL}/favorites`, data)
                    .subscribe();
                alert('Movie added to favorites.');
            }
        });
    }
}

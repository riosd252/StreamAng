import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/service/movies.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/auth/auth-data';
import { Movie } from 'src/app/models/movie';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
    userFavs: Movie[] = [];
    user!: AuthData | null;

    constructor(private movieSrv: MovieService, private authSrv: AuthService) {}

    ngOnInit(): void {
        this.authSrv.user$.subscribe((_user) => {
            this.user = _user;
        });

        this.movieSrv.getFavorites().subscribe((movies: Movie[]) => {
            let favorites: Movie[] = [];
            favorites = movies;
            favorites.forEach((mov) => {
                if (mov.userId === this.user!.user.id) {
                    this.userFavs!.push(mov);
                } else {
                    return;
                }
            });
        });
    }
}

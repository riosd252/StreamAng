import { Component, OnInit } from '@angular/core';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/service/movies.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/auth/auth-data';

@Component({
    selector: 'app-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
    user!: AuthData | null;
    topRated: Movie[] | undefined;
    popular: Movie[] | undefined;

    constructor(
        private moviesSrv: MovieService,
        private authSrv: AuthService
    ) {}

    ngOnInit(): void {
        this.moviesSrv.getTopRated().subscribe((movies: Movie[]) => {
            this.topRated = movies;
        });
        this.moviesSrv.getPopular().subscribe((movies: Movie[]) => {
            this.popular = movies;
        });

        this.authSrv.user$.subscribe((_user) => {
            this.user = _user;
        });
    }

    addToFavs(movie: Movie) {
        let fav: Movie = movie;
        fav.userId = this.user!.user.id;

        this.moviesSrv.addFav(fav);
    }
}

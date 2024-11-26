import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { ExploreComponent } from './core/explore/explore.component';
import { DetailsComponent } from './core/details/details.component';
import { SearchComponent } from './core/search/search.component';
import { GenreComponent } from './core/genre/genre.component';
import  {StreamComponent} from './core/stream/stream.component';
export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent,
        title: 'Entzone'
    },
    {
        path: 'explore',
        component: ExploreComponent,
        title: 'Explore Entzone'
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'movie/:id',
        component: DetailsComponent,
    },
    {
        path: 'search/:query',
        component: SearchComponent,   
    },
    {
        path: 'genre/:genre',
        component:GenreComponent
    },
    {
        path: 'stream/:id/:magnet',
        component: StreamComponent,
    }

];

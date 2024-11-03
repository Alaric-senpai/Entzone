import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YtsService {
  private basurl = environment.baseurl1
  constructor(private http: HttpClient) { }
  
  getmovies(): Observable<any[]> {
    const url = `${this.basurl}/list_movies.json?limit=50`
    return this.http.get<any[]>(url)
  }
  getTrendingmovies(): Observable<any[]> {
    const url = `${this.basurl}/list_movies.json?limit=50&minimum_rating=10&sort_by=rating`
    return this.http.get<any[]>(url)
  }

    getmoviesbypage(page:any): Observable<any[]> {
    const url = `${this.basurl}/list_movies.json?limit=50&page=${page}`
    return this.http.get<any[]>(url)
  }

  getmoviesdetails(id:Number): Observable<any>{
    const url = `${this.basurl}/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
    return this.http.get<any>(url)
  }
  getSimilar(id: any): Observable<any[]>{
    const url = `${this.basurl}/movie_suggestions.json?movie_id=${id}`
    return this.http.get<any[]>(url)
  }

  Search(term: any): Observable<any[]>{
    const url = `${this.basurl}/list_movies.json?query_term=${term}`
    return this.http.get<any[]>(url)
  }

  findByGenre(genre: any, page:any): Observable<any[]>{
    const url = `${this.basurl}/list_movies.json?genre=${genre}&page=${page}&limit=50`
    return this.http.get<any[]>(url)
  }

}

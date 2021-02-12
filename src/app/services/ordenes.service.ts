import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(private http: HttpClient) { }

  getOrdenes(idcliente: string) {
    return this.http.get(`${URL}/ordenes.php?getordenespago=${idcliente}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class SugerenciaService {

  constructor(private http: HttpClient) { }

  crearSugerencia(sugerencia: string) {


    return new Promise(async resolve => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
      await this.http.post(`${URL}/sugerencias.php`, 'sugerencia=' + sugerencia, { headers }).
        subscribe((res: any) => {
          if (res.status === 'correcto') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }
}

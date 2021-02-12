import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage';
import { CheckList } from '../interfaces/interfaces';
const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(private http: HttpClient, private storage: Storage) {
    this.getChecklist();
   }
  checkList: CheckList[] = [];


  getChecklist() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.http.post(`${URL}/checklist.php`, `listarchecklist=1`, { headers}).subscribe( (res: any) => {
      // console.log('checklost', res);
      if ( res.status === 'correcto') {
        this.checkList.push( ... res.checklist);
        this.agregarCheckList(this.checkList);
      }
    });
  }
  async agregarCheckList(checklist: CheckList[]) {
    if ( checklist.length > 0) {
      await this.storage.remove('checklist');
      this.storage.set('checklist', checklist);
    }
  }
  async cargarCheckList() {
    this.checkList = await this.storage.get('checklist');
  }
}

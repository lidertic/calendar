import { Injectable } from '@angular/core';
import { generate } from 'rxjs';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class CsvDataService {
  static rowGeneral: object;
  static numui: number = 0;
  
  /** Generar UID */
  static generateUID(param): string {
    // const _retorn: string = param.DTSTART + Guid.raw() + '@liderticcalendarapp';
    const _retorn: string =
      this.numui.toString() + Guid.raw() + '@liderticcalendarapp';
    return _retorn;
  }

  static twoDigits(cad: string): string {
    // cad = StringUtil.trim(cad);
    if (cad.toString().length === 1) {
      cad = '0' + cad;
    }
    return cad;
  }

  static convertFechaHora(fecha: Date, hora: Date): string {
    const cad = `${fecha.getFullYear()}${this.twoDigits(
      (fecha.getMonth() + 1).toString()
    )}${this.twoDigits(fecha.getDate().toString())}T${this.twoDigits(
      hora.getHours().toString()
    )}${this.twoDigits(hora.getMinutes().toString())}00Z`;
    return cad;
  }

  static convertFechaHoraExt(fecha: any, hora: string, minuts: string): string {
    const cad = `${fecha.any}${this.twoDigits(fecha.mes)}${this.twoDigits(
      fecha.dia
    )}T${this.twoDigits(hora)}${this.twoDigits(minuts)}00Z`;
    return cad;
  }

  static convertFechaHoraExt_2(
    fecha: any,
    hora: string,
    minuts: string
  ): string {
    const cad = `${fecha.any}${this.twoDigits(fecha.mes)}${this.twoDigits(
      fecha.dia
    )}`;
    return cad;
  }
}

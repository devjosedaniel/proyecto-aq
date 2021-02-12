export interface RespTrabajos {
  status: string;
  trabajos: Trabajo[];
}

export interface Trabajo {
  observaciones?: any;
  observacion_termino?: any;
  cliente?: string;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: any;
  hora_llegada?: string;
  hora_salida?: string;
  servicio?: string;
  encargado?: string;
  estado?: string;
  idestado?: string;
  foto?: string;
  idtrabajo?: string;
  idpersona?: string;
  foto1?: string;
  codigo_qr?: string;
  latitud?: string;
  longitud?: string;
  sincronizar?: number;
  dateLlegada?: string;
  dateSalida?: string;
  pathimg: string;
  calificacion?: string;
  checklist?: Checlist[];
  checks?: string[];
  pendiente?: number;
}

export interface Checlist {
  id?: string;
  idtrabajo?: string;
  checklist?: string;
}

export interface ResLogin {
  status: string;
  usuario: Usuario;
}

export interface Usuario {
  id?: string;
  usuario?: string;
  clave?: string;
  idrol?: string;
  idreferencia?: string;
  estado?: string;
  token?: string;
  nombrereal?: string;
  qr?: string;
  correo?: string;
  direccion?: string;
  tipoidentificacion?: string;
  identificacion?: string;
  movil?: string;
  telefono?: string;
}


export interface ResQuejas {
  status: string;
  quejas: Queja[];
}

export interface Queja {
  encargado?: string;
  servicio?: string;
  cliente?: string;
  fecha?: string;
  hora_inicio?: string;
  hora_llegada?: string;
  hora_salida?: string;
  queja?: string;
  foto?: string;
}


export interface ResSugerencia {
  status: string;
  sugerencias: Sugerencia[];
}

export interface Sugerencia {
  id?: string;
  texto?: string;
  fecha?: string;
  visto?: string;
}


export interface RespUbicaciones {
  status: string;
  ubicaciones: Ubicacion[];
}

export interface Ubicacion {
  encargado?: string;
  latitud?: string;
  longitud?: string;
}


export interface Mensaje {
  idremitente?: string;
  iddestino?: string;
  usuario?: string;
  texto?: string;
  hora?: string;
  foto?: string;
}
export interface ResServicio {
  status: string;
  servicios: Servicio[];
}
export interface Servicio {
  id?: string;
  nombre?: string;
  descripcion?: string;
}


export interface CheckList {
  id?: string;
  nombre?: string;
  estado?: string;
}

export interface OrdenPago {
  detalle?: string;
  estado?: string;
  fecha?: string;
  hora_pago?: string;
  id?: string;
  idcliente?: string;
  total?: number;
}

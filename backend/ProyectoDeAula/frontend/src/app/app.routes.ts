import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard';
import { ClientesComponent } from './clientes/clientes';
import { PrestamosComponent } from './prestamos/prestamos';
import { UsuariosComponent } from './usuarios/usuarios';
import { MiPerfilComponent } from './mi-perfil/mi-perfil';
import { MisPrestamosComponent } from './mis-prestamos/mis-prestamos';
import { ConfiguracionComponent } from './configuracion/configuracion';
import { authGuard } from './auth.guard';
import {HistorialAbonosComponent} from './historial-abonos/historial-abonos';
import {SolicitarPrestamoComponent} from './solicitar-prestamo/solicitar-prestamo';
import {AbonosPendientesComponent} from './abonos-pendientes/abonos-pendientes';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'panel',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'prestamos', component: PrestamosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'mi-perfil', component: MiPerfilComponent },
      { path: 'mis-prestamos', component: MisPrestamosComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'historial-abonos', component: HistorialAbonosComponent },
      { path: 'solicitar-prestamo', component: SolicitarPrestamoComponent },
      { path: 'abonos-pendientes', component: AbonosPendientesComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

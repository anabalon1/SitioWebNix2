import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { PerfilComponent } from './perfil';
import { AuthGuard } from './_guards/auth.guard';
import { NoAuthGuard } from './_guards/noAuth.guards';
import { LibroDeAguaComponent } from './libroDeAgua';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'libroDeAgua', component: LibroDeAguaComponent, canActivate: [AuthGuard] },
    { path: '', component: PerfilComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent , canActivate: [NoAuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
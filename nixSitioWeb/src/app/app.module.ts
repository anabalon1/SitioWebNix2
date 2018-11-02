import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent }  from './app.component';
import { routing }        from './app.routing';

import { AlertComponent } from './_directives';
import { AuthGuard } from './_guards/auth.guard';
import { NoAuthGuard } from './_guards/noAuth.guards';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AlertService, AuthenticationService, UserService, RolService, EstadoService, PuestoService , TipoRescateService} from './_services';
import { HomeComponent } from './home';
import { LibroDeAguaComponent } from './libroDeAgua';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { PerfilComponent } from './perfil'

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LibroDeAguaComponent,
        LoginComponent,
        RegisterComponent,
        PerfilComponent
    ],
    providers: [
        AuthGuard,
        NoAuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        RolService,
        EstadoService,
        PuestoService,
        TipoRescateService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
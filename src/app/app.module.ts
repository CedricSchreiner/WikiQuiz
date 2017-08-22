import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { TimerbarComponent } from './timerbar/timerbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BackgroundComponent } from './background/background.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RestService } from './service/rest.service';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {OptionsComponent} from "./options/options.component";

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'game', component: QuizComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'options', component: OptionsComponent}

  {path: 'menu', component: MenuComponent},
  {path: 'stats', component: StatisticsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    TimerbarComponent,
    NavbarComponent,
    BackgroundComponent,
    LoginComponent,
    SignupComponent,
    OptionsComponent,
    MenuComponent
    MenuComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule
  ],
  providers: [RestService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { TimerbarComponent } from './timerbar/timerbar.component';
import { BackgroundComponent } from './background/background.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RestService } from './service/rest.service';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { OptionsComponent } from './options/options.component';
import { InfoComponent} from './info/info.component';
import {AvatarComponent} from './avatar/avatar.component';
import {PasswordComponent} from './password/password.component';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'game', component: QuizComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'options', component: OptionsComponent},
  {path: 'stats', component: StatisticsComponent},
  {path: 'info', component: InfoComponent},
  {path: 'avatar', component: AvatarComponent},
  {path: 'password', component: PasswordComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    TimerbarComponent,
    BackgroundComponent,
    LoginComponent,
    SignupComponent,
    OptionsComponent,
    InfoComponent,
    MenuComponent,
    StatisticsComponent,
    AvatarComponent,
    PasswordComponent
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

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { TimerbarComponent } from './timerbar/timerbar.component';
import { BackgroundComponent } from './background/background.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RestService } from './service/rest.service';
import { SignupComponent } from './signup/signup.component';
import { NavbarloginComponent } from './navbar-login-view/navbarlogin.component';
import { NavbarmenuComponent } from './navbar-menu-view/navbarmenu.component';
import { MenuComponent } from './menu/menu.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { OptionsComponent } from './options/options.component';
import { InfoComponent } from './info/info.component';
import { AvatarComponent } from './avatar/avatar.component';
import { PasswordComponent } from './password/password.component';
import { SurvivalQuizService } from './quiz/survivalquiz';
import { QuizComponent } from './quiz/quiz.component';
import { XQuizService } from './quiz/xquiz';
import { FiftyFiftyJokerService } from './quiz/fifty_fifty_joker';
import { PopupComponent } from './popup/popup.component';

const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'game', component: QuizComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'options', component: OptionsComponent},
  {path: 'stats', component: StatisticsComponent},
  {path: 'info', component: InfoComponent},
  {path: 'avatar', component: AvatarComponent},
  {path: 'password', component: PasswordComponent},
  {path: 'result', component: PopupComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    TimerbarComponent,
    BackgroundComponent,
    LoginComponent,
    NavbarloginComponent,
    NavbarmenuComponent,
    SignupComponent,
    OptionsComponent,
    QuizComponent,
    InfoComponent,
    MenuComponent,
    StatisticsComponent,
    AvatarComponent,
    PasswordComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    BrowserModule,
  ],
  providers: [RestService, SurvivalQuizService, XQuizService, FiftyFiftyJokerService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { TimerbarComponent } from './timerbar/timerbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BackgroundComponent } from './background/background.component';
import { LoginComponent} from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    TimerbarComponent,
    NavbarComponent,
    BackgroundComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { EducationComponent } from './components/education/education.component';
import { ProjectComponent } from './components/project/project.component';
import { LogInComponent } from './components/login/login.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { HttpClientModule } from '@angular/common/http';
import { ExperienceAddComponent } from './components/experience-add/experience-add.component';
import { ExperienceItemComponent } from './components/experience-item/experience-item.component';
import { ExperienceUpdateComponent } from './components/experience-update/experience-update.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EducationAddComponent } from './components/education-add/education-add.component';
import { EducationItemComponent } from './components/education-item/education-item.component';
import { EducationUpdateComponent } from './components/education-update/education-update.component';
import { ProjectAddComponent } from './components/project-add/project-add.component';
import { ProjectItemComponent } from './components/project-item/project-item.component';
import { ProjectUpdateComponent } from './components/project-update/project-update.component';
import { SkillComponent } from './components/skill/skill.component';
import { SkillItemComponent } from './components/skill-item/skill-item.component';
import { SkillAddComponent } from './components/skill-add/skill-add.component';
import { SkillUpdateComponent } from './components/skill-update/skill-update.component';
import { AboutUpdateComponent } from './components/about-update/about-update.component';
import { SocialNetworkItemComponent } from './components/social-network-item/social-network-item.component';
import { FooterComponent } from './components/footer/footer.component';
import { SocialNetworkLinkItemComponent } from './components/social-network-link-item/social-network-link-item.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectComponent,
    LogInComponent,
    PortfolioComponent,
    ExperienceAddComponent,
    ExperienceItemComponent,
    ExperienceUpdateComponent,
    EducationAddComponent,
    EducationItemComponent,
    EducationUpdateComponent,
    ProjectAddComponent,
    ProjectItemComponent,
    ProjectUpdateComponent,
    SkillComponent,
    SkillItemComponent,
    SkillAddComponent,
    SkillUpdateComponent,
    AboutUpdateComponent,
    SocialNetworkItemComponent,
    FooterComponent,
    SocialNetworkLinkItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }

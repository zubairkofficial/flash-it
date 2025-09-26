import { Component } from '@angular/core';
import { Profile } from '../pages/profile/profile';
import { ChangePassword } from '../pages/change-password/change-password';
import { SiteHeader } from '../shared/site-header/site-header';
import { SignedInSidebar } from '../shared/signed-in-sidebar/signed-in-sidebar';

@Component({
  selector: 'app-settings',
  imports: [Profile,ChangePassword,SignedInSidebar,SiteHeader],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {

}

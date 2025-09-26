import { Component, Input } from '@angular/core';
import { AuthRoutingModule } from "../../auth/auth.routes";
import { SignedOutHeader } from "../../shared/signed-out-header/signed-out-header";
import { Footer } from "../../shared/footer/footer";

@Component({
  selector: 'app-signed-out-layout',
  imports: [AuthRoutingModule, SignedOutHeader, Footer],
  templateUrl: './signed-out-layout.html',
  styleUrl: './signed-out-layout.css',
})
export class SignedOutLayout {

}

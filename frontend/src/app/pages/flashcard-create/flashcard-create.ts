import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GenerateFlashcardSection } from '../../generate-flashcard-section/generate-flashcard-section';
import { notyf } from '../../../utils/notyf.utils';

@Component({
  selector: 'app-flashcard-create',
  imports: [GenerateFlashcardSection],
  templateUrl: './flashcard-create.html',
  styleUrl: './flashcard-create.css',
})
export class FlashcardCreate {
  workspaceId: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe((params) => {
      const wsId = params.get('workspaceId') || params.get('id');
      if (wsId) {
        this.workspaceId = +wsId;
      } else {
        notyf.error('Workspace ID is required');
        this.router.navigate(['dashboard']);
      }
    });
  }
}

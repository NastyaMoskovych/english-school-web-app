import { Pipe, PipeTransform } from '@angular/core';
import { formatAnswer } from './answer-format.pipe';

@Pipe({
  name: 'answers',
  standalone: true,
})
export class AnswersPipe implements PipeTransform {
  transform(answers: string[]): string[] {
    return answers.map((answer: string, idx: number) =>
      formatAnswer(answer, idx),
    );
  }
}

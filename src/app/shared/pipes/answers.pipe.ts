import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'answers',
  standalone: true,
})
export class AnswersPipe implements PipeTransform {
  transform(answers: string[]): string[] {
    return answers.map(
      (answer: string, idx: number) =>
        `${String.fromCharCode(idx + 97).toUpperCase()}. ${answer}`,
    );
  }
}

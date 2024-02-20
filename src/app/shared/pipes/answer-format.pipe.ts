import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'answerFormat',
  standalone: true,
})
export class AnswerFormatPipe implements PipeTransform {
  transform(value: string, idx: number): string {
    return formatAnswer(value, idx);
  }
}

export const formatAnswer = (value: string, idx: number): string => {
  return `${String.fromCharCode(idx + 97).toUpperCase()}. ${value}`;
};

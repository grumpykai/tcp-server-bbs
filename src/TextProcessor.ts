// TypeScript code

export class TextProcessor {
  /* Refactored version of TextProcessorOld 
  - will have an array of lines only
  - will have an addText method that will add text to the array of lines
    - will split the text into lines and immediately add the newline character to each array entry, apart from the last one
  - will have a method to split a line into words
    - will split the line into words and immediately add the space character to each array entry, apart from the last one
  - will have a method to split a words exceeding the line length into smaller words fitting into the line width
*/

  public lines: string[] = [];

  public readonly maxCharsPerLine;
  public readonly maxLinesPerPage;

  constructor(maxLinesPerPage = 24, maxCharsPerLine = 40) {
    this.maxLinesPerPage = maxLinesPerPage;
    this.maxCharsPerLine = maxCharsPerLine;

    this.lines.push("");
  }

  public addText(text: string): string {
    const incomingLines = text.split("\n");

    let delta = "";

    const lines = incomingLines.map((line, index) =>
      index < incomingLines.length - 1 ? (line += "\n") : line
    );

    for (const line of lines) {
      const words = line.split(" ");

      const splitWords1 = this.truncateWordsExceedingLineLength(words);

      const splitWords = splitWords1.map((word, index) =>
        index < splitWords1.length - 1 ? word + " " : word
      );

      for (const word of splitWords) {
        const { oldLine, newLine, overflow } = this.addWordToCurrentLine(
          this.lines[this.lines.length - 1],
          word
        );

        this.lines[this.lines.length - 1] = oldLine;

        if (overflow) {
          this.lines.push(newLine);
        }

        delta += word + newLine;
      }

      if (line.endsWith("\n")) {
        this.lines.push("");
      }
    }

    return delta;
  }

  public truncateWordsExceedingLineLength(words: string[]): string[] {
    const splitWords: string[] = [];

    for (let word of words) {
      while (word.length > this.maxCharsPerLine) {
        const splitWord = word.slice(0, this.maxCharsPerLine);
        word = word.slice(this.maxCharsPerLine);
        splitWords.push(splitWord + "\n");
      }
      splitWords.push(word);
    }

    return splitWords;
  }

  public addWordToCurrentLine(
    line = "",
    word: string
  ): { oldLine: string; newLine: string; overflow: boolean } {
    let lineOverflow = false;

    let newLine = "";

    let oldLine = line;

    if (line.length + word.length + 1 < this.maxCharsPerLine) {
      // this._lastDelta += this._currentLine.length ? ` ${word}` : word;
      oldLine += word;
    } else {
      oldLine += "\n";
      newLine = word;
    }

    return { oldLine, newLine, overflow: lineOverflow };
  }

  public getPages() {
    const { pages, currentPage } = this._getPages();

    return pages.concat([currentPage]);
  }

  public getCurrentPage() {
    const { pages, currentPage } = this._getPages();

    return currentPage;
  }

  private _getPages() {
    const pages: string[][] = [];

    let currentPage: string[] = [];

    this.lines.forEach((line) => {
      if (currentPage.length === this.maxLinesPerPage) {
        pages.push(currentPage);
        currentPage = [];
      } else {
        currentPage.push(line);
      }
    });

    return { pages, currentPage };
  }

  // Method to flip uppercase to lowercase and vice versa for each character in a string
  public flipCase(str: string): string {
    const result = str
      .split("")
      .map((char) =>
        char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
      )
      .join("");

    return result;
  }
}

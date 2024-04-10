// TypeScript code

/*

- Each entry in the array represents one page
- a page shall have a maximum of 24 lines 
- a line shall not exceed 40 characters
- lines shall be split between words to not exceed 40 characters
- the incoming text stream may contain new line characters. These must be considered to not exceed the 24 lines of a page as well as the newline characters that will be inserted by your source code

*/

export class TextProcessor {
  public pages: string[][] = [];
  public readonly maxLinesPerPage;
  public readonly maxCharsPerLine;

  private _currentLine = "";
  private _currentPage: string[] = [];

  private _lastDelta = "";

  constructor(maxLinesPerPage = 24, maxCharsPerLine = 40) {
    this.maxLinesPerPage = maxLinesPerPage;
    this.maxCharsPerLine = maxCharsPerLine;
  }

  public moveCurrentLineToCurrentPage(): boolean {
    let pageOverflow = false;

    if (this._currentPage.length < this.maxLinesPerPage) {
      this._currentPage.push(this._currentLine);
    } else {
      this.pages.push(this._currentPage);
      this._currentPage = [];
      this._currentPage.push(this._currentLine);
      pageOverflow = true;
    }

    this._lastDelta += "\n";

    this._currentLine = "";

    return pageOverflow;
  }

  public truncateWordsExceedingLineLength(words: string[]): string[] {
    const splitWords: string[] = [];

    for (let word of words) {
      while (word.length > this.maxCharsPerLine) {
        const splitWord = word.slice(0, this.maxCharsPerLine);
        word = word.slice(this.maxCharsPerLine);
        splitWords.push(splitWord);
      }
      word.length && splitWords.push(word);
    }

    return splitWords;
  }

  public addWordToCurrentLine(word: string): boolean {
    let lineOverflow = false;

    if (this._currentLine.length + word.length + 1 < this.maxCharsPerLine) {
      this._lastDelta += this._currentLine.length ? ` ${word}` : word;
      this._currentLine += this._currentLine.length ? ` ${word}` : word;
    } else {
      lineOverflow = true;
      this.moveCurrentLineToCurrentPage();
      this._currentLine = word;

      this._lastDelta += word;
    }

    return lineOverflow;
  }

  public addText(text: string): string {
    this._lastDelta = "";

    const incomingLines = text.split("\n");

    for (let j = 0; j < incomingLines.length; j++) {
      const line = incomingLines[j];

      const lastLineOfIncomingText = j === incomingLines.length - 1;

      // Empty line indicates a new paragraph
      if (line.length === 0 && !lastLineOfIncomingText) {
        this.moveCurrentLineToCurrentPage();
        continue;
      }

      const words = line.split(" ");

      const splitWords = this.truncateWordsExceedingLineLength(words);

      for (let i = 0; i < splitWords.length; i++) {
        const word = splitWords[i];

        const lineOverflow = this.addWordToCurrentLine(word);

        const lastWordOfIncomingLine = i === splitWords.length - 1;

        // Each line is a paragraph except the last line of the incoming text.
        if (lastWordOfIncomingLine && !lastLineOfIncomingText) {
          this.moveCurrentLineToCurrentPage();
        }
      }
    }

    return this._lastDelta;
  }

  public getCurrentPage() {
    // Add the current line to a copy of the current page

    const currentPage = this._currentPage.slice();
    currentPage.push(this._currentLine);

    return currentPage;
  }

  public getPages() {
    const result = this.pages.concat([this.getCurrentPage()]);

    return result;
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

// const textProcessor = new TextProcessor();

// // Simulate processing of a stream

// textProcessor.addText(`
// 1) Politely greet the customer by nameinformhimaboutthebackgroundinacaringmannerandaskifthecustomercan think of a reason for this sudden increase in consumption. Do not provide examples why the consumption may have increased at this point. At the end of this response add in a new line the following tag: <consumption_overview_previousperiod_forecast/>
// Example

// to start the conversation: "Hello {first_name}! Welcome at OpenUtil, Ltd. and thanks a lot for getting in touch with us. We have noticed an increase..."
// 2) If the customer’s answer indicates that he has no idea about why the consumption has increased, mention potential reasons such as installation of a wallbox to charge an electric car or switching to electrical heating.
// 3) If the customer’s next response still indicates that he has no idea, propose that a service technician could visit to check the installation and or whether energy theft by a third-party may be taking place.
// 4) If the customer is interested in such a visit, tell him that he will shortly receive an e-mail with potential appointments. Afterwards ask the customer, if you can help him any further.
// 5) If at any of the previously described steps, the customer mentions an idea or fact why the consumption has increased take one of the following steps:
// - If the customer has installed a wallbox you can offer a special electric car tariff named "E-Mobility SPECIAL" that covers 1000 kWh per month for a fixed price of 50 USD per month. The electricity can only be used for charging the customer's electric car. The cost of "E-Mobility SPECIAL" is therefore 600 USD flat for one year.
// - If the customer has installed electrical heating, he already has the cheapest tarif available. Tell this and ask if you can help any further.
// 6) In case that the customer indicates interest in the proposed new tariff, ask if he would like to switch from his current tariff to the new tariff.
// 7) If the customer confirms the change, you ask for another explicit confirmation of the tariff change for legal reasons by the customer's enter "Yes" in a separaten step.
// 8) If this occured, you confirm the successful change of the tariff. If the customer entered something else, you confirm that the change was cancelled due to the entry.
// 9) Now, there are two options: If the customer switched the tariff and the customer context comprises information that the customer's home is especially suited for solar power you proceed with the the next step. Otherwise you ask, if you can help further.
// 10) If the customer's home is especially suited for solar power, ask the customer if he would be interested in the installation of a solar system on the his roof. Details about potential production, respective savings and costs are comprised in the customer context section. Use this and only this information for the conversation with the customer.
// 11)If the customer re-iterates his interest in the offer after you told the above, propose an appointment with a technician for a concluding on-site assessment.
// 12) If the customer confirms, ask if you should provide a proposal for a potential appointment date.
// 13) If you get a positive response, propose a date. Potential appointment dates, you will also find in the customer context section. Use these and only these for the customer conversation.
// 14) If the customer confirms this date, tell that you booked it and that an e-mail was sent with the respective appointment information.
// 15) Finally ask, if you can help further.`);

// const pages = textProcessor.pages;

// // Output the processed pages

// for (let i = 0; i < pages.length; i++) {
//   console.log(`Page ${i + 1}:`);
//   // console.log(pages[i].join("\n"));

//   for (let j = 0; j < pages[i].length; j++) {
//     const line = pages[i][j];

//     console.log(
//       `[P ${i.toString().padStart(3, " ")} L ${j
//         .toString()
//         .padStart(3, " ")} LEN ${line.length
//         .toString()
//         .padStart(2, " ")}] ${textProcessor.flipCase(line)}`
//     );
//   }

//   console.log();
// }

import { TextProcessor } from "../src/TextProcessor";

describe("TextProcessor", () => {
  let textProcessor: TextProcessor;

  beforeEach(() => {
    textProcessor = new TextProcessor();
  });

  it("Should split text into pages", () => {
    textProcessor.addText(mockText);

    const pages = textProcessor.getPages();

    expect(pages.length).toBeGreaterThan(0);

    expect(pages).toEqual(expectedPages);
  });

  it("Should flip case of a string", () => {
    const flipped = textProcessor.flipCase("Hello World");

    expect(flipped).toBe("hELLO wORLD");
  });

  it("Should add text provided in multiple calls correctly", () => {
    const deltas: string[] = [];

    deltas.push(textProcessor.addText("Text One "));
    deltas.push(textProcessor.addText("Text Two\n"));
    deltas.push(textProcessor.addText("Text Three\nText Four "));
    deltas.push(textProcessor.addText("\n"));
    deltas.push(textProcessor.addText("Text Five "));
    deltas.push(textProcessor.addText("\n\n"));
    deltas.push(textProcessor.addText("Text S"));
    deltas.push(textProcessor.addText("ix Text Seven"));

    const pages = textProcessor.getPages();

    expect(pages.length).toBe(1);

    expect(pages[0]).toEqual([
      "Text One Text Two\n",
      "Text Three\n",
      "Text Four \n",
      "Text Five \n",
      "\n",
      "Text Six Text Seven",
    ]);

    expect(deltas).toEqual([
      "Text One ",
      "Text Two\n",
      "Text Three\nText Four ",
      "\n",
      "Text Five ",
      "\n\n",
      "Text S",
      "ix Text Seven",
    ]);
  });

  it.skip("Should return the current page", () => {
    textProcessor.addText("Text One");
    // textProcessor.addText("Text Two");

    expect(textProcessor.getCurrentPage()).toEqual(["Text One"]);
  });
});

const mockText = `1) Politely greet the customer by nameinformhimaboutthebackgroundinacaringmannerandaskifthecustomercan think of a reason for this sudden increase in consumption. Do not provide examples why the consumption may have increased at this point. At the end of this response add in a new line the following tag: <consumption_overview_previousperiod_forecast/>
Example

to start the conversation: "Hello {first_name}! Welcome at OpenUtil, Ltd. and thanks a lot for getting in touch with us. We have noticed an increase..."
2) If the customer’s answer indicates that he has no idea about why the consumption has increased, mention potential reasons such as installation of a wallbox to charge an electric car or switching to electrical heating.
3) If the customer’s next response still indicates that he has no idea, propose that a service technician could visit to check the installation and or whether energy theft by a third-party may be taking place.
4) If the customer is interested in such a visit, tell him that he will shortly receive an e-mail with potential appointments. Afterwards ask the customer, if you can help him any further.
5) If at any of the previously described steps, the customer mentions an idea or fact why the consumption has increased take one of the following steps:
- If the customer has installed a wallbox you can offer a special electric car tariff named "E-Mobility SPECIAL" that covers 1000 kWh per month for a fixed price of 50 USD per month. The electricity can only be used for charging the customer's electric car.`;

const expectedPages = [
  [
    "1) Politely greet the customer by\n",
    "nameinformhimaboutthebackgroundinacaring\n",
    "mannerandaskifthecustomercan think of\n",
    "a reason for this sudden increase in\n",
    "consumption. Do not provide examples\n",
    "why the consumption may have\n",
    "increased at this point. At the end\n",
    "of this response add in a new line\n",
    "the following tag:\n",
    "<consumption_overview_previousperiod_for\n",
    "ecast/>\n",
    "Example\n",
    "\n",
    'to start the conversation: "Hello\n',
    "{first_name}! Welcome at OpenUtil,\n",
    "Ltd. and thanks a lot for getting in\n",
    "touch with us. We have noticed an\n",
    'increase..."\n',
    "2) If the customer’s answer indicates\n",
    "that he has no idea about why the\n",
    "consumption has increased, mention\n",
    "potential reasons such as\n",
    "installation of a wallbox to charge\n",
    "an electric car or switching to\n",
  ],
  [
    "electrical heating.\n",
    "3) If the customer’s next response\n",
    "still indicates that he has no idea,\n",
    "propose that a service technician\n",
    "could visit to check the installation\n",
    "and or whether energy theft by a\n",
    "third-party may be taking place.\n",
    "4) If the customer is interested in\n",
    "such a visit, tell him that he will\n",
    "shortly receive an e-mail with\n",
    "potential appointments. Afterwards\n",
    "ask the customer, if you can help him\n",
    "any further.\n",
    "5) If at any of the previously\n",
    "described steps, the customer\n",
    "mentions an idea or fact why the\n",
    "consumption has increased take one of\n",
    "the following steps:\n",
    "- If the customer has installed a\n",
    "wallbox you can offer a special\n",
    'electric car tariff named "E-Mobility\n',
    'SPECIAL" that covers 1000 kWh per\n',
    "month for a fixed price of 50 USD per\n",
    "month. The electricity can only be\n",
  ],
  ["used for charging the customer's\n", "electric car."],
];

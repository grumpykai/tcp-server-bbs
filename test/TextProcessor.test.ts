import { TextProcessor } from "../src/TextProcessor";

describe("TextProcessor", () => {
  let textProcessor: TextProcessor;

  beforeEach(() => {
    textProcessor = new TextProcessor();
  });

  it("should split text into pages", () => {
    textProcessor.addText(mockText);

    expect(textProcessor.pages.length).toBeGreaterThan(0);

    expect(textProcessor.pages).toEqual(expectedPages);
  });

  it("should flip case of a string", () => {
    const flipped = textProcessor.flipCase("Hello World");

    expect(flipped).toBe("hELLO wORLD");
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
    "1) Politely greet the customer by",
    "nameinformhimaboutthebackgroundinacaring",
    "mannerandaskifthecustomercan think of a",
    "reason for this sudden increase in",
    "consumption. Do not provide examples",
    "why the consumption may have increased",
    "at this point. At the end of this",
    "response add in a new line the",
    "following tag:",
    "<consumption_overview_previousperiod_for",
    "Example",
    'to start the conversation: "Hello',
    "{first_name}! Welcome at OpenUtil, Ltd.",
    "and thanks a lot for getting in touch",
    "with us. We have noticed an",
    "2) If the customer’s answer indicates",
    "that he has no idea about why the",
    "consumption has increased, mention",
    "potential reasons such as installation",
    "of a wallbox to charge an electric car",
    "or switching to electrical heating.",
    "3) If the customer’s next response",
    "still indicates that he has no idea,",
    "propose that a service technician could",
  ],
  [
    "visit to check the installation and or",
    "visit to check the installation and or",
    "energy theft by a third-party may be",
    "taking place.",
    "4) If the customer is interested in",
    "such a visit, tell him that he will",
    "shortly receive an e-mail with",
    "potential appointments. Afterwards ask",
    "the customer, if you can help him any",
    "5) If at any of the previously",
    "described steps, the customer mentions",
    "an idea or fact why the consumption has",
    "increased take one of the following",
    "- If the customer has installed a",
    "wallbox you can offer a special",
    'electric car tariff named "E-Mobility',
    'SPECIAL" that covers 1000 kWh per month',
    "for a fixed price of 50 USD per month.",
    "The electricity can only be used for",
    "charging the customer's electric car.",
  ],
];

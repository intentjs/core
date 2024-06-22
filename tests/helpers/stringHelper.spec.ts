import { Str } from "../../lib/utils/strings";

describe("String Helper", () => {
  beforeEach(async () => {});

  it("should trim", () => {
    expect(Str.trim(" vinayak ")).toBe("vinayak");
  });

  it("should replace using string", () => {
    const string = "vinayak don";
    const find = "don";
    const replace = "sarawagi";
    expect(Str.replace(string, find, replace)).toBe("vinayak sarawagi");
  });

  it("should replace all occurences using string", () => {
    const string = "vinayak don don don don";
    const find = "don";
    const replace = "sarawagi";
    expect(Str.replace(string, find, replace)).toBe(
      "vinayak sarawagi sarawagi sarawagi sarawagi"
    );
  });

  it("should replace all occurences using regex", () => {
    const string = "Virat Kohli says Ben Stokes";
    const replacements = {
      "Ben Stokes": "OUT!!",
    };
    expect(Str.swap(string, replacements)).toBe("Virat Kohli says OUT!!");
  });

  it("should convert to snake case", () => {
    const string = "IntentJs - For the devs_whoHaveTheIntent";
    expect(Str.snake(string)).toBe(
      "intent_js_for_the_devs_who_have_the_intent"
    );
  });
});

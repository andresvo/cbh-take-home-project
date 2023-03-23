const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the same string when given string event.partitionKey input", () => {
    const trivialKey = deterministicPartitionKey({partitionKey: "abc"});
    expect(trivialKey).toBe("abc");
  });

  it("Returns number converted to string when given integer event.partitionKey input", () => {
    const trivialKey = deterministicPartitionKey({partitionKey: 123});
    expect(trivialKey).toBe("123");
  });

  it("Returns hash when given string input", () => {
    const event = "other";
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });

  it("Returns hash when given object input without partitionKey", () => {
    const event = {foo: "bar"};
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(crypto.createHash("sha3-512").update(JSON.stringify(event)).digest("hex"));
  });

  it("Returns hash when given >256 character event.partitionKey input", () => {
    const event = {partitionKey: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam mi purus, vehicula vel ante eget, commodo varius turpis. Donec at porttitor lectus. Praesent vel placerat lectus. Curabitur non magna tellus. Etiam dictum libero ac urna feugiat blandit. Proin arcu metus, blandit ut."};
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(crypto.createHash("sha3-512").update(event.partitionKey).digest("hex"));
  });
});

// Sample test to ensure Jest is working
describe("Jest Setup", () => {
  it("should pass a basic test", () => {
    expect(1 + 1).toBe(2);
  });

  it("should have access to __DEV__ global", () => {
    expect(__DEV__).toBeDefined();
  });
});

test("Review search returns array of results", async () => {
  const response = await fetch(
    "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/reviews",
  );

  const result = await response.json();
  const data = Array.isArray(result) ? result : (result?.Items ?? result?.data ?? []);

  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
}, 15_000);

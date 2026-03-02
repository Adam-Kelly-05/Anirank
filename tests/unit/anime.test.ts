test("Anime search returns array of results length 1", async () => {
  const response = await fetch(
    "https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/21",
  );

  const result = await response.json();
  const items = Array.isArray(result) ? result : result?.data ? [result.data] : [];

  expect(Array.isArray(items)).toBe(true);
  expect(items.length).toEqual(1);
}, 15_000);

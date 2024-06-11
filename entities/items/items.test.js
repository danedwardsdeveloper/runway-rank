const { getAllItems, getTotalItems, getTop10 } = require("./items.controller");

test("getAllItems fetches all items and returns them as JSON", async () => {
  // Mock the pool.query function (assuming you use Jest mocking)
  const mockQuery = jest.fn().mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });
  pool.query = mockQuery;

  const req = {}; // Mock request object (not used in this function)
  const res = { json: jest.fn() }; // Mock response object

  await getAllItems(req, res);

  expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM items"); // Verify query execution
  expect(res.json).toHaveBeenCalledWith({ rows: [{ id: 1 }, { id: 2 }] }); // Verify response data
});

import chai from "chai";
const expect = chai.expect;

describe("getAllItems function", () => {
  it("fetches all items and returns them as JSON", async () => {
    // Mock database interaction (using a library like Sinon)
    const mockQuery = {}; // Replace with actual mocking logic
    pool.query = mockQuery;

    const req = {}; // Mock request object (not used in this function)
    const res = { json: sinon.spy() }; // Mock response object using Sinon

    await getAllItems(req, res);

    expect(mockQuery).to.have.been.calledOnce; // Verify query execution
    expect(res.json).to.have.been.calledOnceWith([
      {
        /* sample item data */
      },
    ]); // Verify response data
  });
});

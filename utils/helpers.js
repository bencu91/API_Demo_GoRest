
const expectStatus = (expectedCode) => {
  pm.test(`Status is ${expectedCode}`, () => {
    pm.response.to.have.status(expectedCode);
  });
};

const validateSchema = (data, schema) => {
  pm.test("Schema is valid", () => {
    pm.expect(tv4.validate(data, schema)).to.be.true;
  });
};

const expectFastResponse = (maxMs = 2000) => {
  pm.test(`Response under ${maxMs}ms`, () => {
    pm.expect(pm.response.responseTime).to.be.below(maxMs);
  });
};
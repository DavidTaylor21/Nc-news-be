const request = require("supertest");
const app = require("../app");
const db = require('../db/connection')
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  describe("GET topics", () => {
    test("Server should respond with status code 200 and array of all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          const topics = response.body.topics;
          expect(topics).toHaveLength(3)
          topics.forEach((topic) =>{
            expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          })
        });
    });
  });
});
describe("Test for endpoints that dont exist", () => {
    test("should return an error message of page not found", () => {
      return request(app)
        .get("/api/robot")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Page not found");
        });
    });
  });

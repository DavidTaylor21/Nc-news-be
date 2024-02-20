const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");
require("jest-sorted");

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
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
          });
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
describe("/api", () => {
  test("should respond with 200 and object describing all the available endpoints on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body.endpointsInformation).toHaveProperty("GET /api");
        expect(response.body.endpointsInformation["GET /api"]).toHaveProperty(
          "description"
        );
        expect(response.body.endpointsInformation["GET /api"]).toHaveProperty(
          "queries"
        );
        expect(response.body.endpointsInformation["GET /api"]).toHaveProperty(
          "exampleResponse"
        );
        expect(response.body.endpointsInformation).toEqual(endPoints);
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("SHould respond with 200 status and an object corresponding to the given article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.article_id).toBe(1);
        expect(typeof response.body.article.title).toBe("string");
        expect(typeof response.body.article.topic).toBe("string");
        expect(typeof response.body.article.author).toBe("string");
        expect(typeof response.body.article.body).toBe("string");
        expect(typeof response.body.article.created_at).toBe("string");
        expect(typeof response.body.article.votes).toBe("number");
        expect(typeof response.body.article.article_img_url).toBe("string");
      });
  });
  test("Should respond with 404 and message article not found for article id given that does not exist", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("Should respons with 400 and message bad request for article id that is not a number", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("/api/articles", () => {
  test("Should respond with 200 status code and an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        response.body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("should respond with 200 status code and an array of comments for given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        expect(response.body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        response.body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("Should respond with 404 status code and message article not found for article_id that doesnt exist", () => {
    return request(app)
    .get("/api/articles/9999999/comments")
    .expect(404)
    .then((response) => {
        expect(response.body.msg).toBe('article not found')
    })
  });
  test('Should respond with 200 and an empty array for article id that exists but there are no comments', () =>{
    return request(app)
    .get("/api/articles/2/comments")
    .expect(200)
    .then((response) => {
        expect(response.body.comments.length).toBe(0)
    })
  })
  test('Should respond with 400 and message bad request for article_id that is not a number', () => {
    return request(app)
    .get("/api/articles/notanumber/comments")
    .expect(400)
    .then((response) => {
        expect(response.body.msg).toBe('Bad request')
    })
  })
});

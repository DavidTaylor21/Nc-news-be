const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
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
      .get("/api/endpointdoesntexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Page not found");
      });
  });
});
describe("GET /api", () => {
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
describe("GET /api/articles/:article_id", () => {
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
  test("Should respond with 400 and message bad request for article id that is not a number", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/articles", () => {
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
describe("GET /api/articles/:article_id/comments", () => {
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
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("Should respond with 200 and an empty array for article id that exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0);
      });
  });
  test("Should respond with 400 and message bad request for article_id that is not a number", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("Should respond with 201 and the comment posted", () => {
    const newComment = {
      username: "rogersop",
      body: "a comment for this article",
    };
    return request(app)
      .post("/api/articles/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(typeof response.body.comment.comment_id).toBe("number");
        expect(response.body.comment.body).toBe("a comment for this article");
        expect(response.body.comment.article_id).toBe(5);
        expect(response.body.comment.author).toBe("rogersop");
        expect(response.body.comment.votes).toBe(0);
        expect(typeof response.body.comment.created_at).toBe("string");
      });
  });
  test("Should respond with 400 bad request when passed an article_id that is not a number", () => {
    const newComment = {
      username: "rogersop",
      body: "a comment for this article",
    };
    return request(app)
      .post("/api/articles/notanumber/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("Should respond with 404 article not found for an article_id that doesnt exist", () => {
    const newComment = {
      username: "rogersop",
      body: "a comment for this article",
    };
    return request(app)
      .post("/api/articles/9999999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("Should respond with 400 and bad request when the body doesnt contain body property ", () => {
    const newComment = {
      username: "rogersop",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("Should respond with 400 and bad request when the body doesnt contain username", () => {
    const newComment = {
      body: "a comment for this article",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("Should respond with 200 and responds with updated article when increasing votes", () => {
    const body = { inc_votes: 5 };
    const expectedOutput = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 105,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle).toEqual(expectedOutput);
      });
  });
  test("Should respond with 200 and responds with updated article when decreasing votes", () => {
    const body = { inc_votes: -5 };
    const expectedOutput = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 95,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle).toEqual(expectedOutput);
      });
  });
  test("Should respond with 200 and updated article with votes below 0", () => {
    const body = { inc_votes: -200 };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedArticle.votes).toBe(-100);
      });
  });
  test("Should respond with 400 and bad request when body contains value that is not a number", () => {
    const body = { inc_votes: "notanumber" };
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("Should respond with 400 and content missing if body is empty", () => {
    const body = {};
    return request(app)
      .patch("/api/articles/1")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("Should respond with 404 for article_id that does not exist", () => {
    const body = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/999999")
      .send(body)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("Should respond with 400 for article_id that is not a number", () => {
    const body = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/notanumber")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("Should respond with 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("Should respond with 404 comment does not exist for comments that dont exist", () => {
    return request(app)
      .delete("/api/comments/9999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment does not exist");
      });
  });
  test("Should respond with 400 bad request for comment_id given thats not a number", () => {
    return request(app)
      .delete("/api/comments/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("GET api/users", () => {
  test("Should respond with 200 and an array of objects containing all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
describe("QUERY api/articles?topic", () => {
  test("Should respond with 200 and array of articles about the topic specified", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(1);
        expect(response.body.articles[0].topic).toBe("cats");
      });
  });
  test("Should respond with 404 topic not found for query that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=topicdoesnotexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("topic not found");
      });
  });
  test("Should respond with 200 and an empty array for a valid topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toEqual([]);
      });
  });
});
describe('NEW FEATURE /api/articles/:article_id (comment_count)', () => {
    test('should respond with 200 status code and an article containing the comment count property', () => {
        return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        console.log(response.body.article)
        expect(response.body.article.comment_count).toBe(11)
        expect(response.body.article.article_id).toBe(1)
      })
    })
})

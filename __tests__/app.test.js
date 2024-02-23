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
        expect(Array.isArray(response.body.articles)).toBe(true);
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
        expect(Array.isArray(response.body.comments)).toBe(true);
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
describe("NEW FEATURE /api/articles/:article_id (comment_count)", () => {
  test("should respond with 200 status code and an article containing the comment count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article.comment_count).toBe(11);
        expect(response.body.article.article_id).toBe(1);
      });
  });
});
describe("sort by query /api/articles", () => {
  test("Should respond with 200 and the articles sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("Should respond with 200 and the articles sorted by topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test("Should respond with 200 and the articles sorted by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("Should respond with 200 and the articles sorted by votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("Should respond with 200 and the articles sorted by comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("Should respond with 200 and the articles sorted by article_id", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("article_id", {
          descending: true,
        });
      });
  });
  test("Should respond with bad request 400 for column that does not exist", () => {
    return request(app)
      .get("/api/articles/sort_by=columnthatdoesntexist")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("ORDER /api/articles", () => {
  test("Should respond with 200 and articles ordered by specified order", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("Should respond with 200 and articles ordered by comment_count in ascending order when specified", () => {
    return request(app)
      .get("/api/articles?order=ASC&sort_by=comment_count")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("comment_count", {
          descending: false,
        });
      });
  });
  test("Should respond with 400 bad request for order that is not asc or desc", () => {
    return request(app)
      .get("/api/articles/order=notavalidorder")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/users/:username", () => {
  test("Should respond with 200 and an object containing the user requested", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then((response) => {
        expect(response.body.user).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("Should respond with 404 user not found when user doesnt exist", () => {
    return request(app)
      .get("/api/users/userdoesnotexist")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("user not found");
      });
  });
});
describe("PATCH /api/comments/comment_id", () => {
  test("Should respond with 200 and responds with updated comment when increasing votes", () => {
    const body = { inc_votes: 5 };
    const expectedOutput = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 21,
      author: "butter_bridge",
      article_id: 9,
      created_at: "2020-04-06T12:17:00.000Z",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedComment).toEqual(expectedOutput);
      });
  });
  test("Should respond with 200 and responds with updated comment when decreasing votes", () => {
    const body = { inc_votes: -5 };
    const expectedOutput = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 11,
      author: "butter_bridge",
      article_id: 9,
      created_at: "2020-04-06T12:17:00.000Z",
    };
    return request(app)
      .patch("/api/comments/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedComment).toEqual(expectedOutput);
      });
  });
  test("Should respond with 200 and updated comment with votes below 0", () => {
    const body = { inc_votes: -200 };
    return request(app)
      .patch("/api/comments/1")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.updatedComment.votes).toBe(-184);
      });
  });
  test("Should respond with 400 and bad request when body contains value that is not a number", () => {
    const body = { inc_votes: "notanumber" };
    return request(app)
      .patch("/api/comments/1")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("Should respond with 400 and content missing if body is empty", () => {
    const body = {};
    return request(app)
      .patch("/api/comments/1")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("Should respond with 404 for comment_id that does not exist", () => {
    const body = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/999999")
      .send(body)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment not found");
      });
  });
  test("Should respond with 400 for comment_id that is not a number", () => {
    const body = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/notanumber")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("GET /api/comments/comment_id", () => {
  test("SHould respond with 200 status and an object corresponding to the given comment id", () => {
    const expectedOutput = {
      comment_id: 1,
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      votes: 16,
      author: "butter_bridge",
      article_id: 9,
      created_at: 1586179020000,
    };
    return request(app)
      .get("/api/comments/1")
      .expect(200)
      .then((response) => {
        expect(response.body.comment.comment_id).toBe(1);
        expect(typeof response.body.comment.body).toBe("string");
        expect(typeof response.body.comment.votes).toBe("number");
        expect(typeof response.body.comment.author).toBe("string");
        expect(typeof response.body.comment.article_id).toBe("number");
        expect(typeof response.body.comment.created_at).toBe("string");
      });
  });
  test("Should respond with 404 and message comment not found for comment id given that does not exist", () => {
    return request(app)
      .get("/api/comments/9999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment not found");
      });
  });
  test("Should respond with 400 and message bad request for comment id that is not a number", () => {
    return request(app)
      .get("/api/comments/notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("POST /api/articles", () => {
  test("Should return 200 and object article that has been posted", () => {
    const body = {
      author: "icellusedkars",
      title: "some random title",
      body: "a body for a random title",
      topic: "cats",
      article_img_url:
        "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.article.author).toBe("icellusedkars");
        expect(response.body.article.title).toBe("some random title");
        expect(response.body.article.body).toBe("a body for a random title");
        expect(response.body.article.topic).toBe("cats");
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?w=700&h=700"
        );
        expect(typeof response.body.article.article_id).toBe("number");
        expect(typeof response.body.article.votes).toBe("number");
        expect(typeof response.body.article.created_at).toBe("string");
        expect(typeof response.body.article.comment_count).toBe("number");
      });
  });
  test("responds with 200 and object article when passed body not containing img url", () => {
    const body = {
      author: "icellusedkars",
      title: "some random title",
      body: "a body for a random title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(200)
      .then((response) => {
        expect(response.body.article.author).toBe("icellusedkars");
        expect(response.body.article.title).toBe("some random title");
        expect(response.body.article.body).toBe("a body for a random title");
        expect(response.body.article.topic).toBe("cats");
        expect(response.body.article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
        expect(typeof response.body.article.article_id).toBe("number");
        expect(typeof response.body.article.votes).toBe("number");
        expect(typeof response.body.article.created_at).toBe("string");
        expect(typeof response.body.article.comment_count).toBe("number");
      });
  });
  test("Should respond with 400 and content missing when the body doesnt contain author", () => {
    const body = {
      title: "some random title",
      body: "a body for a random title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("Should respond with 400 and content missing when the body doesnt contain title", () => {
    const body = {
      author: "icellusedkars",
      body: "a body for a random title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("Should respond with 400 and content missing when the body doesnt contain body", () => {
    const body = {
      title: "some random title",
      author: "icellusedkars",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("Should respond with 400 and content missing when the body doesnt contain topic", () => {
    const body = {
      title: "some random title",
      body: "a body for a random title",
      author: "icellusedkars",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("content missing from body");
      });
  });
  test("should respond with 400 bad request when topic does not exist", () => {
    const body = {
      author: "icellusedkars",
      title: "some random title",
      body: "a body for a random title",
      topic: "notatopic",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("not a valid topic");
      });
  });
  test("should respond with 400 bad request when author does not exist", () => {
    const body = {
      author: "notavalidauthor",
      title: "some random title",
      body: "a body for a random title",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(body)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("not a valid author");
      });
  });
});
describe("QUERY limit and p api/articles", () => {
  test("should respond with 200 and a array of 5 articles when limit is set to 5, on 2nd page", () => {
    return request(app)
      .get("/api/articles?limit=5&p=2&sort_by=article_id&order=ASC")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(5);
        expect(response.body.articles[0].article_id).toBe(6);
        expect(response.body.articles[0].total_count).toBe(13);
      });
  });
  test("should respond with 200 and an array of 10 articles when limit and p are both omitted", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(10);
      });
  });
  test("Should respond with 200 and an array of page 2 when limit is ommited by p is set to 2", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=ASC&p=2")
      .expect(200)
      .then((response) => {
        expect(response.body.articles[0].article_id).toBe(11);
      });
  });
  test("should respond with 200 and array of articles length set by limit on first page when p is omitted", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=ASC&limit=2")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(2);
        expect(response.body.articles[0].article_id).toBe(1);
      });
  });
  test("should respond with 200 and an empty array for page requests with no results", () => {
    return request(app)
      .get("/api/articles?p=99999")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(0);
      });
  });
  test("should respond with 400 for page query that is not a number", () => {
    return request(app)
      .get("/api/articles?p=notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("should respond with 400 for limit query that is not a number", () => {
    return request(app)
      .get("/api/articles?limit=notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
describe("QUERY limit and p api/articles/:article_id/comments", () => {
  test("should respond with 200 and a array of 2 comments when limit is set to 2, on 2nd page", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2&p=2")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
        expect(typeof response.body.comments[0].total_count).toBe("number");
      });
  });
  test("should respond with 200 and an array of 10 comments when limit and p are both omitted", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(10);
      });
  });
  test("Should respond with 200 and an array of page 2 when limit is ommited by p is set to 2", () => {
    return request(app)
      .get("/api/articles/1/comments?p=2")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(1);
      });
  });
  test("should respond with 200 and array of comments length set by limit on first page when p is omitted", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=2")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
      });
  });
  test("should respond with 200 and an empty array for page requests with no results", () => {
    return request(app)
      .get("/api/articles/1/comments?p=99999")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0);
      });
  });
  test("should respond with 400 for page query that is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?p=notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("should respond with 400 for limit query that is not a number", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=notanumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3030;

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type rootQuery {
            events : [String!]!
        }

        type rootMutation {
            createEvent(name : String) : String
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
        
        `),
    rootValue: {
      events: () => {
        return ["event1", "event2", "event3"];
      },
      createEvent: args => {
        return args.name;
      }
    },
    graphiql: true
  })
);

app.get("/home", (req, res) => {
  res.statusCode = 200;
  res.send("Hello boy!!");
});

app.listen(port, () => {
  console.log(`application started on ${port}`);
});

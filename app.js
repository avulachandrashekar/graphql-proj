const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();
const events = [];
app.use(bodyParser.json());
const port = process.env.PORT || 3030;

app.use(
  "/graphql",
  graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id : ID!
            title : String!
            price : Float!
            description : String!
            date : String!
        }

        input EventInput {
            title : String!
            price : Float!
            description : String!
            date : String! 
        }

        type rootQuery {
            events : [Event!]!
        }

        type rootMutation {
            createEvent(eventInput : EventInput) : Event
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
        
        `),
    rootValue: {
      events: () => {
        return events;
      },
      createEvent: args => {
        let event = {
          _id: Math.floor(Math.random() * 1000).toString(),
          title: args.eventInput.title,
          price: args.eventInput.price,
          description: args.eventInput.description,
          date: args.eventInput.date
        };
        events.push(event);
        return event;
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

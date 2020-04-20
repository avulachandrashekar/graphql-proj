const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const graphqlHttp = require("express-graphql");
const {
    buildSchema
} = require("graphql");
const Event = require('./models/event');
const User = require('./models/user');

const app = express();
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
            creator : User!
        }

        type User {
            _id : ID!
            email : String!
            password : String
            createdEvents : [Event!]!
        }

        input CreateUserInput {
            email : String!
            password : String!
        }

        input EventInput {
            title : String!
            price : Float!
            description : String!
            date : String! 
        }

        type rootQuery {
            events : [Event!]!
            users : [User!]!
        }

        type rootMutation {
            createEvent(eventInput : EventInput) : Event
            createUser(userInput : CreateUserInput) : User
        }

        schema {
            query: rootQuery
            mutation: rootMutation
        }
        
        `),
        rootValue: {
            events: () => {
                return Event.find();
            },
            users: () => {
                return User.find();
            },
            createEvent: args => {
                let event = new Event({
                    title: args.eventInput.title,
                    price: args.eventInput.price,
                    description: args.eventInput.description,
                    date: new Date(args.eventInput.date)
                })
                return event.save()
                    .then((res) => {
                        return {
                            ...res._doc
                        }
                    })
                    .catch(err => console.log(err));
            },
            createUser: (args) => {
                return User.findOne({
                        email: args.userInput.email
                    })
                    .then(user => {
                        if (user) {
                            throw new Error("User already exists.")
                        } else {
                            return bcrypt.hash(args.userInput.password, 12)
                        }
                    })
                    .then(hashedPass => {
                        let user = new User({
                            email: args.userInput.email,
                            password: hashedPass
                        });
                        return user.save();
                    })
                    .then(user => {
                        return {
                            ...user._doc,
                            _id: user.id
                        }
                    })
                    .catch(err => {
                        throw err
                    })
            }
        },
        graphiql: true
    })
);

app.get("/home", (req, res) => {
    res.statusCode = 200;
    res.send("Hello boy!!");
});

mongoose.connect(`mongodb+srv://Chandra:NewPassword@cluster0-acnkx.mongodb.net/react-graphql-dev?retryWrites=true&w=majority`)
    .then(response => {
        console.log("successfully connected to mongodb...");
        app.listen(port, () => console.log(`application started on ${port}`))
    })
    .catch(err => console.log(err))
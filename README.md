# trivia--backend

![alt not found](./trivia--backend.jpg)

https://app.creately.com/diagram/NlH88ez9Ror/edit


# ENDPOINTS

## auth:
#### /auth/google
    - GET
####  /auth/github
    - GET
####  /auth/email
    - GET

    - POST
        {email: String}
####  /auth/logout
    - GET
---
## user:
#### /user/:username
    - GET

    - PATCH
        {
          username: String,
          email: String,
          dob: Date,
          nat: String,
          img: String,
          options: {
            joker: Boolean,
            timer: Boolean,
          },
        }

    - DELETE
#### /user/:username/games
    - GET

    - POST
        {
          score: Number,
          categories:
            { // 6x !!!
              name: String,
              answers: [Boolean], // 1-5x 
            },
        }

#### /user/:username/upload
    - POST
        {pngFile} // profile image

#### /user/:username/ranks
    - GET
        [under construction]

#### /user/:username/stats
    - GET
        [under construction]
---
## other:
### /ranks
    - GET

### /stats
    - GET
### /feedback
    - POST
        {
          value: Number, // 1-5
          message: String,
        }

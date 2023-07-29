# Pure Match Coding Challenge

| Commit         | Branch       | Description                                                        |
| -------------- | ------------ | ------------------------------------------------------------------ |
| Initial commit | main         | Project setup                                                      |
| Requirement 1  | requirement1 | created routes and middleware; set up sequelize; updated README.md |

## Approach :thought_balloon:

**Requirement 1:**

- Sequelize is used as ORM to establish connection to the PostgreSQL database.
- Email and password are validated using regex and required fields are also validated before moving forward.
- Bcrypt is used to hash password given by user.
- User credential data is assumed to be sent inside `req.body` using raw `JSON` format.
- `jsonwebtoken` is used to sign and verify JWTs.
- JWT are stored in `cookies`. The `cookies` have attributes `httpOnly`, `sameSite`, and `secure` to prevent XSS attacks and possibly CSRF attacks depending on client domain. CORS can also be implemented for a specific client to prevent CSRF attacks.
- Invalid JWT can be stored to database, if desired.
- AWS S3 is used to store photos when supplied by user and photo name is saved to database.

<br>

**Requirement 2:**
<br><br>

**Requirement 3:**

## Screenshots :camera:

**Requirement 1:**

- `POST /register`

![register-route](https://github-production-user-asset-6210df.s3.amazonaws.com/101021415/256503788-ed5ba554-7779-4311-a24d-f981b920f07a.PNG)

- `POST /login`

![login-route](https://github-production-user-asset-6210df.s3.amazonaws.com/101021415/256503859-66e8d06c-ec4e-4f2a-89a4-61e77e0c7613.PNG)

- `POST /post`

![post-route](https://github.com/preetsc27/node-coding-question/assets/101021415/72e416fb-5628-4b08-b7b7-01020222d5c6)

- `GET /posts`

![get-posts-route](https://github.com/sequelize/cli/assets/101021415/e66de815-eb83-42d3-b116-4f7e87d289d3)

- `GET /logout`

![logout-route](https://github.com/preetsc27/node-coding-question/assets/101021415/856960cc-13b7-49d4-a59d-41189cd42018)

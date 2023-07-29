# Pure Match Coding Challenge

| Commit         | Branch       | Description                                                                                                                            |
| -------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Initial commit | main         | Project setup                                                                                                                          |
| Requirement 1  | requirement1 | created routes and middleware; set up sequelize; updated README.md                                                                     |
| Requirement 2  | requirement2 | added time difference for posts; modified `Posts` table; added `Photos` table; added `PUT` and `DELETE` endpoints for posts and photos |
| Requirement 3  | requirement3 | added comments to posts; added pagination to posts and comments; added optional addition of username                                   |

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

- `createdAt` attribute for posts automatically added by Sequelize upon model creation and first migration.
- To process up to 5 photos, `Posts` table is modified to have a `photoCount` column and deleted `photo` column. Photo data are moved to a new `Photos` table with `id`, `name` and `postID` (referencing to `Posts` table IDs) columns.
- The number of photos that can be uploaded is assumed to be controlled by the client as it is stated in the requirement.
- The `POST /post` API endpoint is updated with the following:
  - Sequelize `transaction` method is utilized to ensure that all of the new post's attributes are successfully saved to the database and stored in AWS S3. If any of these fails, `rollback` method is called to undo all changes so far.
  - Sequelize `bulkCreate` method is used to save all photos at once to the database.
- The `GET /post` API endpoint is updated with the following:
  - `LEFT JOIN` is utilized to get the posts and associated photos, connected by `postID` foreign key.
  - Time difference is calculated with `new Date()` and `createdAt` values by `getTimeDiff.js`. Example of return: `5mo ago`.
- Posts can be edited with `PUT /post` API endpoint. The `transaction` method is used again to ensure that all processes are successful. First, the title and description is updated in the `Posts` table using the post's `id`. If there are new photos to be added, they are added using `bulkCreate` method, then the `photoCount` in `Posts` table is incremented by the number of new photos. Finally, when all is successful, the photos are then added in AWS S3.
- `DELETE` `/post` and `/photos` API endpoints do not use the `transaction` method. Instead, they make use of the `destroy` method's return value and checks if the target rows are deleted before moving forward.

<br>

**Requirement 3:**

- `Comments` table is created to save comments made on posts, connected to `Posts` and `Users` tables with `postId` and `userId` foreign keys.
- Comments pagination is modeled from Instagram comments. When a button to view comments is clicked, the first `n` latest comments are fetched. When a user clicks a button to view more comments, an API call to `GET /comments/:postId/:limit/:offset?` is called and fetches the next `n` latest comments and so on.
- `GET /posts` API endpoint is changed to `GET /posts/:limit/:offset?` and Sequelize query is modified to include limit and offset to add pagination to posts.
- `PUT /username` API endpoint is created to allow existing users to optionally add a username to their account.
- The `Users` table is modified to add a `username` column using a migration file and the `User` model is changed to reflect this change.

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

**Requirement 2:**

- `GET /posts`

![updated-get-posts-route](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/5754930f-442b-4d14-8ab2-a47376a122bc)

- `POST /post`

![updated-post-route](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/9c6158d1-2321-40c3-80c9-4c949fea510b)

- `POST /post` 400 error - Missing title

![post-route-error](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/7c40a1c6-8566-4fad-9ea1-99c31a9f2b02)

- `PUT /post`

![update-post-route](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/62d45c4e-a5fb-4a14-aa1c-f2de155cd796)

- `DELETE /post`

![delete-post-route](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/4eea5614-8fad-479c-8e91-904077474656)

- `DELETE /post` 404 error - Post is not found and destroyed

![delete-post-error](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/5e3a072f-894d-4dd1-b9b3-44c488400d6c)

- `DELETE /photos`

![delete-photos-route](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/41804595-8b04-44a2-8133-b9c627e041b3)

- `DELETE /photos` 400 error - Photos and postId do not correlate and nothing is destroyed

![delete-photos-error](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/58e78724-0175-4ff8-82a3-3c6e1c8b1f02)

**Requirement 3:**

- `GET /posts/:limit/:offset?`

Page 1:

![updated-get-posts](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/e186339f-9847-4e82-98ab-36db0bf77d9a)

Page 2:

![updated-get-posts2](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/5ab3b129-8523-4f3f-b871-802fac8d1ae5)

- `GET /comments/:postId/:limit/:offset?`

Page 1:

![get-comments1](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/30a7aa2e-6142-4c2a-9225-b2ced8ea93ae)

Page 2:

![get-comments2](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/94d7d708-3dbe-4c54-ab09-1de5a625d7e3)

- `POST /comment`

![create-comment](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/5be4f059-e23f-4e7f-ba16-d74015c84294)

- `POST /comment` 400 error - missing comment content

![create-comment-error](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/e59c6bc0-3199-49e5-be03-3183cc63c1f1)

- `PUT /username`

![add-username](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/775f6a71-3efc-4865-a482-b1322702af04)

- `PUT /username` 400 error - missing username

![add-username-error1](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/31a94905-6fd7-4409-b961-0477ae671ee8)

- `PUT /username` 400 error - duplicate username

![add-username-error2](https://github.com/jojo-138/coding-challenge-pure-match/assets/101021415/e0bb556d-3541-430a-b401-a1d0bbacaf5e)

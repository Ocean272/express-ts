http://localhost:3000/users

1) POST a new user with the following format
{
  "email": "...",
  "password": "...."
}

2) Go to MongoDB or MongoDB Compass to change this user's permissionFlags to 2147483647

3) Go back to YARC and retrieve the accessToken 
request:  POST  http://localhost:3000/auth
Payload:
{
  "email": "...",
  "password": "...."
}

4) Append the headers with
  - Accept    application/json
  - Authorization     Bearer ..<accessToken>..

5) Now this user has all right permission to all routes. 

<!-- Input the above accesstoken in the header:
-- header 'Content-Type': application/json
-- header 'Authorization': Bearer ....<accessToken string>....


  "_id": "SINkX_7a6",
  "email": "huawei@gmail.com",
  "permissionFlags": 2147483647,
  "__v": 0,
  "firstName": "Hua",
  "lastName": "Wei" 
  
  "password"; "12345" -->

  

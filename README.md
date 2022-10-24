http://localhost:3000/users

1) POST a new user with the following format
{
  "email": "...",
  "password": "...."
}

2) Go to MongoDB or MongoDB Compass to change the permissionFlags to 2147483647

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

  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJTSU5rWF83YTYiLCJlbWFpbCI6Imh1YXdlaUBnbWFpbC5jb20iLCJwZXJtaXNzaW9uRmxhZ3MiOjIxNDc0ODM2NDcsInJlZnJlc2hLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlsyMTIsMjQyLDEyMiwxMzQsOTgsOCwyMDcsNDIsNTIsMTM2LDI1NCwxMSwxMTUsMTcsMjIwLDE4NF19LCJpYXQiOjE2NjY2MzE3OTAsImV4cCI6MTY2NjY2Nzc5MH0.1Fc3kjYlBmUzcxuBsxUMTaJZ0OKUqpEZwH8i8wHJRf0",
  "refreshToken": "h5+B4FMnvsGYnhZ04yBE2d474lqqE9PU5DUAzr1I+8cHWpxNpnLboZm5zXLqsqdsuJyURplMAmbfHo2BcJYuog=="


  "_id": "SINkX_7a6",
  "email": "huawei@gmail.com",
  "permissionFlags": 2147483647,
  "__v": 0,
  "firstName": "Hua",
  "lastName": "Wei" -->

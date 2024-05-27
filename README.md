# tetris-game
A practice of Tetris game.

# Backend
    server port: 8080
## APIs
**Users**
 - POST /users **createUser**
 > usage: Create a User(創造使用者)
```json
key: value(type and limits)

json request 
"username": string, Alphanumeric,
"password": string, min=6,
"email": string, email format

json response
"username": string,
"email": string,
"password_changed_at": time,
"created_at": time
```
 - POST /users/login **loginUser** 
 > usage: User login (Also create access token and refresh token for user) (使用者登入，同時也創造access token和refresh token作為登入時的授權手段)
```json
key: value(type and limits)

json request 
"username": string, Alphanumeric,
"password": string, min=6

json response
"access_token": string,
"access_token_expires_at": time,
"refresh_token": string,
"refresh_token_expires_at": time,
"user":
{
    "username": string,
    "email": string,
    "password_changed_at": time,
    "created_at": time
}
```

**Tokens**
 - POST /tokens/renew_access **renewToken**
 > usage: Renew token using refresh token. If refresh token was compromised, then it will ask user to login again to renew tokens. (使用refresh token更新token。如果refresh token被盜用，則系統會要求使用者重新登入)
```json
key: value(type and limits)

json request 
"refresh_token": string,

json response
"access_token": string,
"access_token_expires_at": time,
"refresh_token": string,
"refresh_token_expires_at": time,
```

**Scores**
 - POST /scores **createScores**
 > usage: Create a score (創造分數)
```json
key: value(type and limits)

json request 
"score": int, > 0,
"level": int, > 0,

json response
"id": int,
"owner": string,
"score": int,
"level": int,
"created_at": time
```
 - GET /scores **listScores**
 > usage: Get Scores by given owner, page id and page size from url (獲取分數透過url中的使用者名稱、page id和page size)
```json
owner: username
page_id: int, min=1
page_size: int, min=5, max=10

example url: localhost:8080/scores?owner=isaac&page_id=1&page_size=5

json response
[
    "id": int,
    "owner": string,
    "score": int,
    "level": int,
    "created_at": time
]
```
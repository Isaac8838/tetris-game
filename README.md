# tetris-game
A practice of Tetris game.

# Docker
cd to root of project directory i.e. path/to/tetris-game

build and start container:
```bash
docker compose up --build -d
```

for delete container and volumes, using:
```bash
docker compose down -v
```
> [!NOTE]
> notice that image should delete manually at docker desktop or using CLI command.

# Backend
    server port: 8080
## APIs
**Users**
 - POST /users **createUser**
 > usage: Create a User(創造使用者)

key: value(type and limits)
json request 
```json
"username": "string, alphanumeric",
"password": "string, min=6",
"email": "string, email format"
```

json response
```json
"username": "string",
"email": "string",
"skin_id": "int32",
"balance": "int64",
"password_changed_at": "time",
"created_at": "time"
```
 - POST /users/login **loginUser** 
 > usage: User login (Also create access token and refresh token for user) (使用者登入，同時也創造access token和refresh token作為登入時的授權手段)

key: value(type and limits)
json request 
```json
"username": "string, Alphanumeric",
"password": "string, min=6"
```

json response
```json
"access_token": "string",
"access_token_expires_at": "time",
"refresh_token": "string",
"refresh_token_expires_at": "time",
"user":
{
    "username": "string",
    "email": "string",
    "skin_id": "int32",
    "balance": "int64",
    "password_changed_at": "time",
    "created_at": "time"
}
```

 - GET /users **userProfile**
 > usage: Getting user personal information (not including password). (取得使用者個人資訊，但不包含密碼)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

json response
```json
"owner": "string",
"email": "string",
"password_changed_at": "time",
"created_at": "time"
``` 

---

**Tokens**
 - POST /tokens/renew_access **renewToken**
 > usage: Renew token using refresh token. If refresh token was compromised, then it will ask user to login again to renew tokens. (使用refresh token更新token。如果refresh token被盜用，則系統會要求使用者重新登入)

key: value(type and limits)
json request 
```json
"refresh_token": "string"
```

json response
```json
"access_token": "string",
"access_token_expires_at": "time",
"refresh_token": "string",
"refresh_token_expires_at": "time"
```

---

**Scores**
 - POST /scores **createScores**
 > usage: Create a score (創造分數)

key: value(type and limits)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

http body
```json
"score": "int, >= 0",
"level": "int, > 0"
```

json response
```json
"id": "int",
"owner": "string",
"score": "int",
"level": "int",
"created_at": "time"
```
 - GET /scores **listScores**
 > usage: Get Scores by given owner, page id and page size from url (獲取分數透過url中的使用者名稱、page id和page size)

owner: string, alphanumeric
page_id: int, min=1
page_size: int, min=5, max=10

example url: localhost:8080/scores?owner=isaac&page_id=1&page_size=5

json response
```json
[
    "id": "int",
    "owner": "string",
    "score": "int",
    "level": "int",
    "created_at": "time"
]
```

---

**Rank**
 - GET /rank/scores rankByScore
 - GET /rank/levels rankByLevels
 > usage: rank the scores and levels by descending order (以大到小排序分數以及等級)

page_id: int, min=1
page_size: int, min=5, max=10

example url: localhost:8080/rank/scores?page_id=1&page_size=5<br>
example url: localhost:8080/rank/levels?page_id=1&page_size=5

json response
```json
[
    "id": "int",
    "owner": "string",
    "score": "int",
    "level": "int",
    "created_at": "time"
]
```

---

**Achievements**
 - GET /achievements listAchievements
 > usage: list owner's achievements (列出特定使用者的成就)

owner: string, alphanumeric

example url: localhost:8080/achievements?owner=isaac

json response
```json
[
    "owner": "string",
    "achievement_id": "int",
    "achieved_at": "time"
]
```

 - Achievement Table
 ```
 | ID  | 内容                |
| --- | ------------------- |
| 1   | SCORE 10達成         |
| 2   | SCORE 100達成        |
| 3   | SCORE 1000達成       |
| 4   | SCORE 10000達成      |
| 5   | SCORE 100000達成     |
| 6   | LEVEL 5達成          |
| 7   | LEVEL 10達成         |
| 8   | LEVEL 15達成         |
| 9   | LEVEL 20達成         |
| 10  | LEVEL 25達成         |
 ```

---

**Balance**
 - GET /balance
 > usage: Returning user's balance (回傳使用者的餘額)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

response
 ```json
 "owner": "string",
 "balance": "int64",
 "updated_at": "time.Time"
 ```

---

**Skin**

All the skin are represented by a series of numbers.
(所有的skin都是用數字序列表示)

Current Skins are:
```
default
{
    "id": 0,
    "price": 50
}

envelope
{
    "id": 1,
    "price": 50
}

round
{
    "id": 2,
    "price": 50
}
```

---

 - GET /skin/default
 > usage: Getting current default skin (獲取預設skin)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

response
```json
"skin_id": "int64"
```

 - POST /skin/purchase
 > usage: purchasing skin with given amount and skin ID (購買想要的skin)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

http body
```json
"amount": "int64",
"skin_id": "int32"
```

response
```json
"balance": "int64",
"skin_id": "int32"
```

 - POST /skin/set_default
 > usage: setting default skin with given skin ID (設定預設skin)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

http body
```json
"skin_id": "int32"
```

response
```json
"skin_id": "int32"
```

 - GET /skin/list_skins
 > usage: Getting the skins owned by the user (獲得目前使用者的所有skin)

json request header
```json
"Authorization": "Bearer token"
```

example
```json
"Authorization": "Bearer v4.local.245epTMgYnUnoA0xhUQtaxG4_No7hBPwDCpi_-Dg74Fi2VK7sYsmlHzDWe7Xp4KvObpxmplBU2YpMSk7V--YXhXU457owNbxwOsc8a7WN0vlPA55Q6cFR4BLFXRR1RTicHZiJm5vIsiqUvQxkWgoRJdVDPxphz0EZXA2zCmPo9MCVUg_zz-MtYwE_JAW-JWvnBDh3bphE0G38QOdNymnFwDKsdcJ_GjIscSVw-PNbI0qzQjbvjCY8v6J"
```

response
```json
[
    {
        "owner": "string",
        "skin_id": "int32",
        "default_skin": "bool"
    }
]
```

 - GET /skin/list_skin_prices
 > usage: Getting all the skins and the prices (獲取所有skin和其對應價格)

response
```json
[
    {
        "skin_id": "int32",
        "price": "int64"
    }
]
```
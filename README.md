# [109-1] Web Programing Final

### Group : 62

### Deployed at :   http://140.112.30.33:59321

### Demo : https://youtu.be/lb6rl4A_TOg

### 服務內容：

- 這個網站，主要可以讓使用者建立行事曆，並且兼具做報告或朋友聚會之間約時間的功能。

### 使用/操作方式（同上課的流程）:

```
yarn // 下載必要模組
yarn start  // 開啟前端
yarn server // 開啟後端
```

### 用法介紹：

1. **登入／註冊**：建立帳號然後返回輸入密碼即可登入
2. **行事曆**：點擊每天的方框可以前往下個頁面加入行程
3. **每天的行程**：左側顯示行程(**schedule**)、右側顯示的是多人的行程(**election**)，點擊右上角小x可以刪除
![](https://i.imgur.com/Rxo1mhe.png)

5. **創建 schedule、election**：選取想要的顏色，點擊並右滑可以新增時間區域（會自動補齊）下方輸入事件名稱和事件內容，左下按鈕（cancel）可以取消、右邊加入(add)
![](https://i.imgur.com/8Wqn2Ql.png)

7. **election 用法**：
    - **投票連結**：
    創建完 election 後，可以獲得一段*url*形式的參加邀請，點進去登入後可以選擇要不要參加。
    - **選擇有空的時間**：
    接著可以選擇使用者有空的時間（同時會顯示已有的行程在畫面上，縱為使用者的參考），若選擇拒絕則會重新導向原來網址，每次點擊 url 都可以投票，意思是當使用者哪個時候突然又有空了，他可以去把空閒時間加上去。
![](https://i.imgur.com/Nye2jtj.png)

    - **決定時間**：
    election 創建者的投票頁面還可以決定時間，按下去後，我們就會顯示給定時間範圍之中最多人有空的時間區段。
![](https://i.imgur.com/Fn55WIG.png)
### 架構
```
frontend/src
| -- App.js
| -- components
|  | -- DataBlock.js
|  | -- RegisterPage.js
|  | -- ElectionBlock.js
|  | -- ScheduleBlock.js
|  | -- TimeInfo.js
|  | -- TimeLine.js
|  | -- Vote.js
|  | -- VoteJoin.js
| -- index.js


```
```
backend/server
| -- index.js
| -- models
|  | -- election.js
|  | -- register.js
|  | -- schedule.js
|  | -- vote.js

```
### 使用工具：
1. React 
    - react hooks
3. express
4. websocket
5. bcrypt
6. MongoDB
#### 分工：
- b07902046 高長聖
    * 前端畫面呈現、後端製作、deploy到雲端、de樓下寫出來的bug
- b07705046 卓彥廷
    * 後端製作、報告撰寫

#### 心得：
這是第一次做網頁project，發現自己其實對前後端都不太熟，平時大概就只是足夠應付考試而已，真正從頭到尾開發就卡東卡西，就感覺花了很多時間可是結果卻沒有很多，尤其過程中
兩個人寫code的速度有差，而我是比較慢的那個，常常造成組員的困擾。因為這次專題我更熟悉mongoDB的各種query method還有git的運用。
，
，
，

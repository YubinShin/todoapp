/*서버 오픈하는 방법*/
const express = require("express");
const app = express();
/**  express 를 첨부해주세요~ */
/**  app.listen(8080,function(){console.log('listening on 8080')}) */
/** ㄴ 8080번 포트로 들어오면 listening on 8080을 콘솔에 띄워주세요. */
/*서버를 여는 곳 알려주기 8080포트에 서버를 열어주세요~*/
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
/** mongo db atlas 사용하기 */
/** 터미널로 npm install mongodb */
const MongoClient = require("mongodb").MongoClient;
/** method-override 사용하기(수정,삭제 기능에 필요하다) */

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { render } = require("ejs");
app.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
/** session 방식 로그인 기능 만들때 필요한 미들웨어(passport, passport-local, express-session) */

/** ejs사용하기 */
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
/**  미들웨어 추가하기, 나는 static 파일을 보관하기 위해 public 폴더를 사용할게 */

var db;
/**  db에 자료를 저장하기 위해 변수가 하나 필요하다 */
MongoClient.connect(
  "mongodb+srv:/** admin:qwer1234@cluster0.iggptud.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true },
  function (에러, client) {
    if (에러) return console.log(에러);
    /** 에러가 발생했을때 알려줘 */
    db = client.db("todoapp");
    /** todoapp 이라는 데이터베이스에 연결해줘~ */
    /**  db.collection('post').insertOne( {이름 : 'John', _id : 100} , function(에러, 결과){ */
    /**  console.log('저장완료'); */
    /** }); */
    /** 연결되면 알려줘~ */
    app.listen(8080, function () {
      console.log("listening on 8080");
    });
  }
);

app.get("/pet", function (요청, 응답) {
  응답.send("펫용품 사시오");
});

app.get("/beauty", function (요청, 응답) {
  응답.send("뷰티용품 사시오");
});

app.get("/", function (요청, 응답) {
  응답.render(`index.ejs`);
});

app.get("/write", function (요청, 응답) {
  응답.render(`write.ejs`);
});

app.get("/memo", function (요청, 응답) {
  응답.render(`memo.ejs`);
});

app.get("/list", function (요청, 응답) {
  db.collection("post")
    .find()
    .toArray(function (에러, 결과) {
      /**  디비에 저장된 post라는 collection 안의 모든 데이터를 가져와주세요 */
      console.log(결과);
      응답.render(`list.ejs`, { posts: 결과 });
      /** list.ejs 파일에 posts :  결과를 출력해주세요 */
    });
});

app.get("/mongodb", function (요청, 응답) {
  응답.render(`mongodb.ejs`);
});

app.get("/detail/:id", function (요청, 응답) {
  db.collection("post").findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      if (에러) {
        응답.status(400).send({ message: "실패했습니다." });
        return console.log(에러);
      } else {
        console.log(결과);
        응답.render(`detail.ejs`, { data: 결과 });
      }
    }
  );
});

app.get("/edit/:id", function (요청, 응답) {
  db.collection("post").findOne(
    { _id: parseInt(요청.params.id) },
    function (에러, 결과) {
      console.log(결과);
      응답.render(`edit.ejs`, { post: 결과 });
    }
  );
});

/** 링크 연결하기~ */

app.post("/add", function (요청, 응답) {
  응답.send("전송완료");
  console.log(요청.body.title);
  console.log(요청.body.date);

  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (에러, 결과) {
      console.log(결과.totalPost);
      var 총게시물갯수 = 결과.totalPost;
      /** name이 게시물갯수인 데이터를 찾아주세요. 이런 문을 쿼리문이라고 합니다. */
      db.collection("post").insertOne(
        { _id: 총게시물갯수 + 1, 제목: 요청.body.title, 날짜: 요청.body.date },
        function () {
          console.log("저장완료");
          /** 새 게시물을 기록하기 */
          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (에러, 결과) {
              if (에러) {
                return console.log(에러);
              }
            }
          );
          /** counter라는 콜렉션안에 totalPost라는 항목도 1 증가시켜야 함 (수정하기) */
          /** updateOne(),updateMany() 몽고디비에서 무언갈 수정하고 싶을때 사용 */
          /** updateOne(매개변수 , 매개변수 , 매개변수 ) */
          /** updateOne(자료를 찾을 수 있는 이름이나 쿼리문 , 수정할 값($가 붙은 오퍼레이터) , 콜백함수(실패, 성공 시 실행할 코드) ) */
          /**  $set , $inc 등 */
        }
      );
    }
  );
});
/** post 요청을 처리하기 */

app.delete("/delete", function (요청, 응답) {
  console.log(요청.body);
  요청.body._id = parseInt(
    요청.body._id
  ); /** 오브젝트 자료형 다루기 스킬(자료형을 Int로 바꾸기) */
  /** 요청.body에 담겨온 게시물번호를 db에서 찾아 삭제해주세요. */
  db.collection("post").deleteOne(요청.body, function (에러, 결과) {
    console.log("삭제완료");
    응답.status(400).send({ message: "성공했습니다." });
    /** if(에러){return 응답.status(400);} else {응답.status(200).send({message : '성공했습니다.'});}; */
  });
  /** deleteOne({데이터를 찾는 쿼리문이 들어가면 됩니다}) */
});

app.put("/edit/:id", function (요청, 응답) {
  db.collection("post").updateOne(
    { _id: parseInt(요청.body.id) },
    { $set: { 제목: 요청.body.title, 날짜: 요청.body.date } },
    function (에러, 결과) {
      console.log("수정완료");
      응답.redirect("/list");
    }
  );
  /** 폼에 담긴 제목,날짜데이터를 가지고 */
  /** db.colletion에 업데이트함 */
  /** updateOne({바꿀 데이터를 찾는 쿼리문}, */
  /** {$set : {제목 : ??}}, */
  /** function(에러,결과){}) */
  /** 요청.body.id html에서 온 요청중에 name이 id인 값을 찾아주세요 */
});

/** 로그인 기능만들기 */
app.get("/login", function (요청, 응답) {
  응답.render("login.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/fail" }),
  function (요청, 응답) {
    응답.redirect("/");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "id" /** input name="id" */,
      passwordField: "pw" /** input name="pw" */,
      session: true,
      passReqToCallback: false,
    },
    function (입력한아이디, 입력한비번, done) {
      /** console.log(입력한아이디, 입력한비번); */
      db.collection("login").findOne(
        { id: 입력한아이디 },
        function (에러, 결과) {
          if (에러) return done(에러);

          if (!결과)
            return done(null, false, { message: "존재하지않는 아이디요" });
          if (입력한비번 == 결과.pw) {
            return done(null, 결과);
          } else {
            return done(null, false, { message: "비번틀렸어요" });
          }
        }
      );
    }
  )
);

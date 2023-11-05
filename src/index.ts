import devServer from "@/server/dev";
import prodServer from "@/server/prod";
import express from "express";
import { name } from "@/utils";
import { Server } from "socket.io";
import http from "http";
import UserService from "@/service/UserService";
import moment from "moment";

// node serve
const port = 3018;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const userService = new UserService();

// 透過server 推送訊息到前端

// on: 連接
// emit: 傳送
// broadcast:廣播自己本身看不到訊息
// 2.監測連接
io.on("connection", (socket) => {
  // 區分user
  socket.emit("userID", socket.id);

  socket.on(
    "join",
    ({ userName, roomName }: { userName: string; roomName: string }) => {
      const userData = userService.userDataInfoHandler(
        socket.id,
        userName,
        roomName
      );

      // --------------加入聊天室-------------
      // 宣告出一個命名空間用房間名來區分(區分每個房間)
      socket.join(userData.roomName);
      userService.addUser(userData);

      // 根據這個空間去發送(加入)訊息 join- to
      socket.broadcast
        .to(userData.roomName)
        .emit("join", `${userName}加入了${roomName}聊天室`);
    }
  );

  // -----------傳訊息-----------
  socket.on("chat", (msg) => {
    const time = moment.utc();

    const userData = userService.getUser(socket.id);
    // 接到msg 再發回前端
    if (userData) {
      // 只在這個空間去發送訊息
      io.to(userData.roomName).emit("chat", { msg, userData, time });
    }
  });

  // -----------離開聊天室-------------
  socket.on("disconnect", () => {
    const userData = userService.getUser(socket.id);
    const userName = userData?.userName;
    if (userName) {
      // 離開了這個空間的聊天室
      socket.broadcast
        .to(userData.roomName)
        .emit("leave", `${userName}離開${userData.roomName}聊天室`);
    }
    userService.removeUser(socket.id);
  });
});

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});

import "./index.css";
import { io } from "socket.io-client"; // 建立連接
import { UserData } from "@/service/UserService";

type UserMsg = { userData: UserData; msg: string; time: number };

// 1.前端: 建立連接 ->node server (後端)
const clientIo = io();

const url = new URL(location.href);
const userName = url.searchParams.get("user_name");
const roomName = url.searchParams.get("room_name");

const textInput = document.getElementById("textInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const chatBoard = document.getElementById("chatBoard") as HTMLDivElement;
const headerRoomName = document.getElementById(
  "headerRoomName"
) as HTMLParagraphElement;
const backBtn = document.getElementById("backBtn") as HTMLButtonElement;

// 當前的使用者
let userID = "";
// 當前的roomName
headerRoomName.innerHTML = roomName ?? " - ";

// 若沒有輸入返回主頁
if (!userName || !roomName) {
  location.href = "/main/main.html";
}
// 返回鍵
backBtn.addEventListener("click", () => {
  location.href = "/main/main.html";
});

// msg 處理
const msgHandler = (data: UserMsg) => {
  // 解析時間
  const date = new Date(data.time);
  const time = `${date.getHours()} ${date.getMinutes()}`;

  const divBox = document.createElement("div");
  divBox.classList.add("flex", "mb-4", "items-end");

  // 判斷傳訊息的是不是自己
  if (data.userData.id === userID) {
    divBox.classList.add("justify-end");
    divBox.innerHTML = `
        <p class="text-xs text-gray-700 mr-4">${time}</p>
        <div>
        <p class="text-xs text-white mb-1 text-right">${data.userData.userName}</p>
        <p
            class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
        >
            ${data.msg}
        </p>
        </div>
    `;
  } else {
    divBox.classList.add("justify-start");
    divBox.innerHTML = `
        <div>
        <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
        <p
          class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
        >
        ${data.msg}
        </p>
      </div>
      <p class="text-xs text-gray-700 ml-4">${time}</p>`;
  }

  chatBoard.appendChild(divBox);
  textInput.value = "";
  chatBoard.scrollTop = chatBoard.scrollHeight;
};

// 加入、離開的訊息提醒
const roomMsgHandler = (msg: string) => {
  const divBox = document.createElement("div");
  divBox.classList.add("flex", "justify-center", "mb-4", "items-center");
  divBox.innerHTML = `
    <p class="text-gray-700 text-sm">${msg}</p>
    `;
  chatBoard.appendChild(divBox);
  chatBoard.scrollTop = chatBoard.scrollHeight;
};

// 按 submit 傳去後端
submitBtn.addEventListener("click", () => {
  const textValue = textInput.value;
  //chat event
  clientIo.emit("chat", textValue); // 發到後端
});

// emit:發送

// 加入聊天室的發送
clientIo.emit("join", { userName, roomName }); // 發到後端

// -------------從後端收到的-----------
// on:連接

// 加入聊天室
clientIo.on("join", (msg) => {
  roomMsgHandler(msg);
});

// 發送訊息
clientIo.on("chat", (data: UserMsg) => {
  msgHandler(data);
});

// 離開聊天室
clientIo.on("leave", (msg) => {
  roomMsgHandler(msg);
});

// userID
clientIo.on("userID", (id) => {
  userID = id;
});

export type UserData = {
  id: string;
  userName: string;
  roomName: string;
};

export default class UserService {
  private userMap: Map<string, UserData>;

  // 當這個 class 建立時才去執行
  constructor() {
    // 記錄使用者資訊
    this.userMap = new Map();
  }

  addUser(data: UserData) {
    this.userMap.set(data.id, data);
  }

  removeUser(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id);
    }
  }

  getUser(id: string) {
    if (!this.userMap.has(id)) return null;

    const data = this.userMap.get(id);
    if (data) {
      return data;
    }
    return null;
  }

  userDataInfoHandler(
    id: string,
    userName: string,
    roomName: string
  ): UserData {
    return {
      id,
      userName,
      roomName,
    };
  }
}

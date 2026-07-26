export interface User {
  id: string;
  name: string;
  roomId: string;
}

export class RoomManager {
  private users: Map<string, User> = new Map();
  private rooms: Map<string, Set<string>> = new Map();

  addUser(id: string, name: string, roomId: string) {
    const user: User = { id, name, roomId };
    this.users.set(id, user);

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(id);
    return user;
  }

  removeUser(id: string): User | undefined {
    const user = this.users.get(id);
    if (user) {
      this.users.delete(id);
      const room = this.rooms.get(user.roomId);
      if (room) {
        room.delete(id);
        if (room.size === 0) {
          this.rooms.delete(user.roomId);
        }
      }
    }
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getUsersInRoom(roomId: string): User[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    
    return Array.from(room).map(id => this.users.get(id)!).filter(Boolean);
  }
}

<script lang="ts">
  import JoinRoom from "./lib/JoinRoom.svelte";
  import VideoRoom from "./lib/VideoRoom.svelte";
  import { socket } from "./lib/socket";
  import Peer from "simple-peer";

  let joined = false;
  let roomId = "";
  let name = "";

  let localStream: MediaStream | null = null;
  let peersMap: Map<
    string,
    { peer: Peer.Instance; stream: MediaStream | null; name: string }
  > = new Map();
  let uiPeersMap: Map<string, { stream: MediaStream | null; name: string }> =
    new Map();
  let messages: any[] = [];

  function updateUIPeers() {
    const newMap = new Map();
    peersMap.forEach((data, id) => {
      newMap.set(id, { stream: data.stream, name: data.name });
    });
    uiPeersMap = newMap;
  }

  async function handleJoin(event: CustomEvent) {
    name = event.detail.name;
    roomId = event.detail.roomId;

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      joined = true;
      socket.emit("join-room", roomId, name);

      socket.on("room-users", (users: { id: string; name: string }[]) => {
        users.forEach((user) => {
          const peer = createPeer(
            user.id,
            socket.id,
            localStream as MediaStream,
          );
          peersMap.set(user.id, { peer, stream: null, name: user.name });
        });
        updateUIPeers();
      });

      socket.on(
        "user-connected",
        (user: { userId: string; name: string }) => {},
      );

      socket.on("signal", (data: { from: string; signal: any }) => {
        let peerData = peersMap.get(data.from);

        if (!peerData) {
          const peer = addPeer(
            data.signal,
            data.from,
            localStream as MediaStream,
          );
          peersMap.set(data.from, { peer, stream: null, name: "Joining..." });
        } else {
          peerData.peer.signal(data.signal);
        }
      });

      socket.on("user-disconnected", (userId: string) => {
        const peerData = peersMap.get(userId);
        if (peerData) {
          peerData.peer.destroy();
          peersMap.delete(userId);
          updateUIPeers();
        }
      });

      socket.on("chat-message", (data: any) => {
        messages = [...messages, data];
      });
    } catch (err) {
      console.error("Failed to get local stream", err);
      alert("Could not access camera/microphone");
    }
  }

  function createPeer(
    userToSignal: string,
    callerId: string,
    stream: MediaStream,
  ) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { to: userToSignal, signal });
    });

    peer.on("stream", (remoteStream) => {
      const data = peersMap.get(userToSignal);
      if (data) {
        data.stream = remoteStream;
        updateUIPeers();
      }
    });

    return peer;
  }

  function addPeer(incomingSignal: any, callerId: string, stream: MediaStream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { to: callerId, signal });
    });

    peer.on("stream", (remoteStream) => {
      const data = peersMap.get(callerId);
      if (data) {
        data.stream = remoteStream;
        updateUIPeers();
      }
    });

    peer.signal(incomingSignal);
    return peer;
  }

  function handleLeave() {
    peersMap.forEach((data) => data.peer.destroy());
    peersMap.clear();
    updateUIPeers();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    socket.disconnect();
    joined = false;
    localStream = null;
    messages = [];
  }

  function handleChatMessage(event: CustomEvent) {
    const message = event.detail;
    socket.emit("send-message", { roomId, message });
  }
</script>

<main>
  {#if !joined}
    <JoinRoom on:join={handleJoin} />
  {:else}
    <VideoRoom
      {localStream}
      peers={uiPeersMap}
      {roomId}
      localName={name}
      {messages}
      currentUserId={socket.id}
      on:leave={handleLeave}
      on:chatMessage={handleChatMessage}
    />
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #0a0a0b;
    color: #e5e2e3;
    font-family: "Hanken Grotesk", sans-serif;
  }
  main {
    width: 100vw;
    height: 100vh;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ParticipantFeed from './ParticipantFeed.svelte';
  import ChatSidebar from './ChatSidebar.svelte';
  
  export let localStream: MediaStream | null = null;
  export let peers: Map<string, { stream: MediaStream | null, name: string }> = new Map();
  export let roomId: string = '';
  export let localName: string = '';
  export let messages: any[] = [];
  export let currentUserId: string = '';

  const dispatch = createEventDispatcher();
  
  let isMuted = false;
  let isCameraOff = false;
  let showChat = true;

  function toggleMute() {
    isMuted = !isMuted;
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    }
  }

  function toggleCamera() {
    isCameraOff = !isCameraOff;
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = !isCameraOff);
    }
  }

  function leaveRoom() {
    dispatch('leave');
  }

  function handleSendMsg(event: CustomEvent) {
    dispatch('chatMessage', event.detail);
  }

  $: gridColumns = Math.ceil(Math.sqrt(peers.size + 1));
</script>

<div class="layout">
  <div class="main-content">
    <div class="video-grid" style="grid-template-columns: repeat({gridColumns}, minmax(0, 1fr));">
      <!-- Local User -->
      <ParticipantFeed stream={localStream} name={localName} isLocal={true} />
      
      <!-- Remote Peers -->
      {#each Array.from(peers.entries()) as [id, peer]}
        <ParticipantFeed stream={peer.stream} name={peer.name} />
      {/each}
    </div>

    <!-- Control Bar -->
    <div class="control-bar">
      <div class="room-info">{roomId}</div>
      <div class="actions">
        <button class="control-btn {isMuted ? 'danger' : ''}" on:click={toggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button class="control-btn {isCameraOff ? 'danger' : ''}" on:click={toggleCamera}>
          {isCameraOff ? 'Cam On' : 'Cam Off'}
        </button>
        <button class="control-btn {showChat ? 'active' : ''}" on:click={() => showChat = !showChat}>
          Chat
        </button>
        <button class="control-btn danger leave-btn" on:click={leaveRoom}>
          Leave
        </button>
      </div>
    </div>
  </div>

  {#if showChat}
    <div class="sidebar-container">
      <ChatSidebar {messages} {currentUserId} on:send={handleSendMsg} />
    </div>
  {/if}
</div>

<style>
  .layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #0A0A0B;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 16px;
  }

  .video-grid {
    flex: 1;
    display: grid;
    gap: 16px;
    padding-bottom: 90px;
    align-content: center;
  }

  .control-bar {
    position: absolute;
    bottom: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(20, 20, 22, 0.7);
    backdrop-filter: blur(12px);
    padding: 16px 24px;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .room-info {
    color: #849495;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  .control-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #e5e2e3;
    padding: 10px 20px;
    border-radius: 99px;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .control-btn.active {
    background: rgba(0, 240, 255, 0.15);
    color: #00f0ff;
    border: 1px solid rgba(0, 240, 255, 0.3);
  }

  .control-btn.danger {
    background: rgba(255, 59, 59, 0.1);
    color: #FF3B3B;
  }

  .control-btn.danger:hover {
    background: #FF3B3B;
    color: white;
  }

  .leave-btn {
    border-radius: 99px;
    padding: 10px 24px;
    background: #FF3B3B !important;
    color: white !important;
  }

  .sidebar-container {
    width: 320px;
    flex-shrink: 0;
  }
</style>

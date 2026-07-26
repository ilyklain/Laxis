<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  let name = '';
  let roomId = '';

  const dispatch = createEventDispatcher();

  function joinRoom() {
    if (name.trim() && roomId.trim()) {
      dispatch('join', { name, roomId });
    }
  }
</script>

<div class="join-container">
  <div class="join-card">
    <div class="camera-preview">
      <div class="placeholder">Camera Preview</div>
    </div>
    
    <div class="form-group">
      <label for="name">Display Name</label>
      <input type="text" id="name" bind:value={name} placeholder="Enter your name" />
    </div>

    <div class="form-group">
      <label for="roomId">Room ID</label>
      <input type="text" id="roomId" bind:value={roomId} placeholder="Enter room ID" />
    </div>

    <button on:click={joinRoom} disabled={!name || !roomId}>
      Join Meeting
    </button>
  </div>
</div>

<style>
  .join-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: radial-gradient(circle at center, #1c1b1c 0%, #0e0e0f 100%);
    font-family: 'Hanken Grotesk', sans-serif;
  }

  .join-card {
    background: rgba(20, 20, 22, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 24px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .camera-preview {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #0A0A0B;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 24px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .placeholder {
    color: #849495;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  label {
    display: block;
    margin-bottom: 8px;
    color: #e5e2e3;
    font-size: 14px;
    font-family: 'JetBrains Mono', monospace;
  }

  input {
    width: 100%;
    padding: 12px;
    background-color: #131314;
    border: 1px solid #3b494b;
    border-radius: 0.5rem;
    color: #fff;
    font-family: 'Hanken Grotesk', sans-serif;
    font-size: 16px;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: #00f0ff;
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  }

  button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #00f0ff, #7000ff);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-family: 'Sora', sans-serif;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.2s ease;
  }

  button:hover:not(:disabled) {
    opacity: 0.9;
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
  }

  button:disabled {
    background: #353436;
    color: #849495;
    cursor: not-allowed;
  }
</style>

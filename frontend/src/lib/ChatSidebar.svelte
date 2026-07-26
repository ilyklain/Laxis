<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  
  export let messages: {userId: string, name: string, message: string, timestamp: number}[] = [];
  export let currentUserId: string = '';

  const dispatch = createEventDispatcher();
  let text = '';
  let chatContainer: HTMLElement;

  function sendMessage() {
    if (text.trim()) {
      dispatch('send', text);
      text = '';
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  $: if (messages) {
    tick().then(() => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    });
  }
</script>

<div class="chat-sidebar">
  <div class="chat-header">
    <h3>Room Chat</h3>
  </div>
  
  <div class="messages" bind:this={chatContainer}>
    {#each messages as msg}
      <div class="message {msg.userId === currentUserId ? 'own' : ''}">
        <span class="sender">{msg.name}</span>
        <div class="bubble">{msg.message}</div>
      </div>
    {/each}
  </div>

  <div class="input-area">
    <textarea 
      bind:value={text} 
      on:keydown={handleKeydown} 
      placeholder="Type a message..."
      rows="2"
    ></textarea>
    <button on:click={sendMessage} disabled={!text.trim()}>Send</button>
  </div>
</div>

<style>
  .chat-sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #1c1b1c;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
  }

  .chat-header {
    padding: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .chat-header h3 {
    margin: 0;
    color: #00f0ff;
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .message.own {
    align-items: flex-end;
  }

  .sender {
    font-size: 12px;
    color: #849495;
    margin-bottom: 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  .bubble {
    background-color: #353436;
    color: #e5e2e3;
    padding: 8px 12px;
    border-radius: 0.5rem;
    font-size: 14px;
    max-width: 85%;
    word-break: break-word;
  }

  .message.own .bubble {
    background-color: #004f54;
    border: 1px solid #00f0ff;
  }

  .input-area {
    padding: 16px;
    background-color: #131314;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  textarea {
    width: 100%;
    padding: 10px;
    background-color: #201f20;
    border: 1px solid #3b494b;
    border-radius: 0.5rem;
    color: #fff;
    font-family: 'Hanken Grotesk', sans-serif;
    font-size: 14px;
    resize: none;
    box-sizing: border-box;
  }

  textarea:focus {
    outline: none;
    border-color: #00f0ff;
  }

  button {
    width: 100%;
    margin-top: 8px;
    padding: 10px;
    background: #00f0ff;
    color: #002022;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
  }
  
  button:disabled {
    background: #353436;
    color: #849495;
    cursor: not-allowed;
  }
</style>

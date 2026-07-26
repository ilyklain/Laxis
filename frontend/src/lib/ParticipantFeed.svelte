<script lang="ts">
  export let stream: MediaStream | null;
  export let name: string = '';
  export let isLocal: boolean = false;
  
  let videoEl: HTMLVideoElement;

  $: if (videoEl && stream) {
    if (videoEl.srcObject !== stream) {
      videoEl.srcObject = stream;
    }
  }
</script>

<div class="feed-container">
  <video 
    bind:this={videoEl} 
    autoplay 
    playsinline 
    muted={isLocal} 
    class:mirrored={isLocal}
  ></video>
  
  <div class="overlay">
    <span class="name-badge">{name}{isLocal ? ' (You)' : ''}</span>
  </div>
</div>

<style>
  .feed-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #131314;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background-color: #0A0A0B;
  }

  video.mirrored {
    transform: scaleX(-1);
  }

  .overlay {
    position: absolute;
    bottom: 12px;
    left: 12px;
  }

  .name-badge {
    background: rgba(20, 20, 22, 0.8);
    backdrop-filter: blur(8px);
    padding: 4px 8px;
    border-radius: 4px;
    color: #e5e2e3;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
</style>

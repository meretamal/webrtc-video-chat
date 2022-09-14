<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";
  import { socket } from "@/services/socket";
  import { username } from "@/stores/session";
  import { id, caller, callee, ready } from "@/stores/call";

  const dispatch = createEventDispatcher();

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const pc = new RTCPeerConnection(servers);
  let localStream = null;
  let remoteStream = null;
  let localVideo;
  let remoteVideo;

  onMount(() => {
    socket.on("call-began", async () => {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      remoteStream = new MediaStream();

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };

      localVideo.srcObject = localStream;
      remoteVideo.srcObject = remoteStream;
      localVideo.muted = true;

      $ready = true;
    });

    socket.on("offer-sent", async ({ offer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      const { sdp, type } = answerDescription;
      const answer = {
        sdp,
        type,
      };
      socket.emit("create-answer", { id: $id, answer });
    });

    socket.on("answer-sent", async ({ answer }) => {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("candidate-sent", ({ candidate }) => {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("call-ended", () => {
      localVideo.pause();
      localVideo.src = null;
      localVideo.srcObject = null;
      localStream.getTracks().forEach((track) => track.stop());
      remoteVideo.pause();
      remoteVideo.src = null;
      remoteVideo.srcObject = null;
      remoteStream.getTracks().forEach((track) => track.stop());
      dispatch("call-ended");
    });
  });

  $: {
    if ($ready && $username === $caller) {
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-candidate", {
            id: $id,
            candidate: event.candidate.toJSON(),
          });
        }
      };
      (async () => {
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const { sdp, type } = offerDescription;

        const offer = {
          sdp,
          type,
        };

        socket.emit("create-offer", { id: $id, offer });
      })();
    }
  }

  $: {
    if ($ready && $username === $callee) {
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("send-answer-candidate", {
            id: $id,
            candidate: event.candidate.toJSON(),
          });
        }
      };
    }
  }

  onDestroy(() => {
    socket.removeAllListeners();
  });
</script>

<div class="columns is-5">
  <div class="column is-1/2">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video bind:this={localVideo} autoplay />
  </div>
  <div class="column is-1/2">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video bind:this={remoteVideo} autoplay />
  </div>
</div>
{#if $ready}
  <button
    class="button is-danger"
    on:click={() => socket.emit("end-call", { id: $id })}>Finalizar</button
  >
{/if}

<style>
  video {
    width: 100%;
    transform: rotateY(180deg);
    -webkit-transform: rotateY(180deg); /* Safari and Chrome */
    -moz-transform: rotateY(180deg); /* Firefox */
    border-radius: 1rem;
  }
</style>

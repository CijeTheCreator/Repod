/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

interface AudioVisualizerProps {
  onSubmit: () => Promise<any>;
  setRecording: React.Dispatch<React.SetStateAction<File | null>>;
}
const AudioVisualizer = ({ onSubmit, setRecording }: AudioVisualizerProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmited, setHasSubmitted] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );

  useEffect(() => {
    // Audio and visualization setup
    const noise = createNoise3D();
    const context = new window.AudioContext();
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const src = context.createMediaStreamSource(stream);
        src.connect(analyser);
        const recorder = new MediaRecorder(stream);
        const chunks: any = [];

        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const file = new File([blob], "recording.webm", {
            type: "audio/webm",
          });
          setRecording(file);
          onSubmit();
        };

        recorder.start();
        setMediaRecorder(recorder);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const scene = new THREE.Scene();
    const group = new THREE.Group();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current!.offsetWidth / canvasRef.current!.offsetHeight,
      0.1,
      1000,
    );
    camera.position.z = 50;
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      canvasRef.current!.offsetWidth,
      canvasRef.current!.offsetHeight,
    );
    renderer.setClearColor("#064e3b");
    renderer.setPixelRatio(window.devicePixelRatio);
    if (!canvasRef.current) return;
    if (canvasRef.current.children.length > 0)
      canvasRef.current.removeChild(canvasRef.current.children[0]);
    canvasRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(20, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: new THREE.Color("#fff1eb") },
        color2: { value: new THREE.Color("#ecfdf5") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
        }
      `,
      wireframe: true,
    });

    const ball = new THREE.Mesh(geometry, material);
    group.add(ball);
    scene.add(group);

    const onResize = () => {
      renderer.setSize(
        canvasRef.current!.offsetWidth,
        canvasRef.current!.offsetHeight,
      );
      camera.aspect =
        canvasRef.current!.offsetWidth / canvasRef.current!.offsetHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const SILENCE_THRESHOLD = 15; // Minimum amplitude to consider significant
    const THRESHOLD = 150; // Minimum amplitude to consider significant
    let silentTime = 0; // Tracks how long we've been below the threshold
    let lastUpdateTime = Date.now(); // Tracks the last time the render loop updated
    const SILENCE_DURATION = 3000; // Silence duration threshold in milliseconds

    const noAudioEntered = async () => {
      if (hasSubmited) return;
      setHasSubmitted(true);
      stopRecording();
      setIsLoading(true);
    };
    const render = () => {
      analyser.getByteFrequencyData(dataArray);

      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime;
      lastUpdateTime = currentTime;

      const sum = dataArray.reduce(
        (accumulator, value) => accumulator + value,
        0,
      );
      const average = sum / dataArray.length;
      const isAboveThreshold = average > SILENCE_THRESHOLD;

      if (isAboveThreshold) {
        silentTime = 0;
      } else if (average != 0) {
        silentTime += deltaTime;
      }

      if (silentTime >= SILENCE_DURATION) {
        noAudioEntered();
        silentTime = 0;
      }

      const filteredData = dataArray.map((value) =>
        value > THRESHOLD ? value / 2 : 50 / 2,
      );
      const lowerHalfArray = filteredData.slice(0, filteredData.length / 2 - 1);
      const upperHalfArray = filteredData.slice(
        filteredData.length / 2 - 1,
        filteredData.length - 1,
      );

      const lowerMaxFr = Math.max(...lowerHalfArray) / lowerHalfArray.length;
      const upperAvgFr =
        upperHalfArray.reduce((sum, value) => sum + value, 0) /
        upperHalfArray.length /
        upperHalfArray.length;

      ball.rotation.x += 0.001;
      ball.rotation.y += 0.005;
      ball.rotation.z += 0.002;
      WarpBall(
        ball,
        modulate(Math.pow(lowerMaxFr, 0.8), 0, 1, 0, 8),
        modulate(upperAvgFr, 0, 1, 0, 4),
      );

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    function WarpBall(mesh: any, bassFr: number, treFr: number) {
      const MAX_BALL_RADIUS = 50;
      mesh.geometry.vertices.forEach(function (vertex: any, i: any) {
        const offset = mesh.geometry.parameters.radius;
        const amp = 0.01;
        const time = window.performance.now();
        vertex.normalize();
        const rf = 0.00001;
        let distance =
          offset +
          bassFr +
          noise(
            vertex.x + time * rf * 5,
            vertex.y + time * rf * 6,
            vertex.z + time * rf * 7,
          ) *
            amp *
            treFr;
        distance = Math.min(distance, MAX_BALL_RADIUS);
        vertex.multiplyScalar(distance);
      });
      mesh.geometry.verticesNeedUpdate = true;
      mesh.geometry.normalsNeedUpdate = true;
      mesh.geometry.computeVertexNormals();
      mesh.geometry.computeFaceNormals();
    }
    const modulate = (
      val: number,
      minVal: number,
      maxVal: number,
      outMin: number,
      outMax: number,
    ) => {
      const fr = (val - minVal) / (maxVal - minVal);
      const delta = outMax - outMin;
      return outMin + fr * delta;
    };

    render();
    console.log("Calling render");
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      context.close();
    };
  }, [hasSubmited, onSubmit]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {!isLoading ? (
        <h1 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 pb-8">
          Listening...
        </h1>
      ) : (
        <h1 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 pb-8">
          Thinking...
        </h1>
      )}
      <div className={`w-full h-full`} ref={canvasRef}></div>
    </div>
  );
};

export default AudioVisualizer;

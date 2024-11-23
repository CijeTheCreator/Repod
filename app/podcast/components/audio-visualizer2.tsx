/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createNoise3D, NoiseFunction3D } from "simplex-noise";

const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLMediaElement>(null);

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
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Three.js setup
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
    // if (!canvasRef.current || canvasRef.current.children.length > 0) return;
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

    const render = () => {
      const THRESHOLD = 150; // Minimum amplitude to consider significant
      analyser.getByteFrequencyData(dataArray);
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
  }, []);

  return (
    <div>
      <div className="w-full h-full" ref={canvasRef}></div>
      <audio
        ref={audioRef}
        src="/audio.wav"
        controls
        className="hidden"
      ></audio>
    </div>
  );
};

export default AudioVisualizer;

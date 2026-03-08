import { useRef, useState, useCallback } from "react";

export function useAmbientSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ oscillators: OscillatorNode[]; gain: GainNode } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(() => {
    if (nodesRef.current) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2);
    masterGain.connect(ctx.destination);

    const frequencies = [55, 82.5, 110]; // Low A drone with fifth and octave
    const oscillators: OscillatorNode[] = [];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(i === 0 ? 0.5 : 0.25, ctx.currentTime);

      // Subtle slow frequency drift for organic feel
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.05 + i * 0.02, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.3, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    });

    nodesRef.current = { oscillators, gain: masterGain };
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (!nodesRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const { gain, oscillators } = nodesRef.current;

    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

    setTimeout(() => {
      oscillators.forEach((o) => { try { o.stop(); } catch {} });
      ctx.close();
      ctxRef.current = null;
      nodesRef.current = null;
    }, 1600);

    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  return { isPlaying, toggle, stop };
}

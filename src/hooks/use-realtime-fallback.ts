import { useEffect, useRef } from "react";

// Native Blink uses authenticated polling instead of Supabase channels.
// Never overlap requests or keep polling an invisible/unmounted screen.
export function useRealtimePolling(enabled: boolean,onTick: () => void | Promise<void>,intervalMs = 5000) {
 const cb=useRef(onTick);cb.current=onTick;
 useEffect(()=>{
  if(!enabled)return;
  let running=false,disposed=false;
  const tick=async()=>{if(disposed||running||document.visibilityState!=="visible")return;running=true;try{await cb.current()}finally{running=false}};
  const timer=setInterval(()=>void tick(),intervalMs);
  const onVisible=()=>void tick();document.addEventListener("visibilitychange",onVisible);
  return()=>{disposed=true;clearInterval(timer);document.removeEventListener("visibilitychange",onVisible)};
 },[enabled,intervalMs]);
}

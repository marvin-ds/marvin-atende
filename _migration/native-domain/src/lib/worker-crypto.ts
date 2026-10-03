import { sha256 } from '@noble/hashes/sha2.js';
import { hmac } from '@noble/hashes/hmac.js';
import { Buffer } from 'buffer';
function digestor(key?:string){const chunks:Uint8Array[]=[];return{update(value:string){chunks.push(new TextEncoder().encode(value));return this},digest(format:string){const input=Buffer.concat(chunks);const result=key===undefined?sha256(input):hmac(sha256,new TextEncoder().encode(key),input);if(!['hex','base64url'].includes(format))throw new Error('Formato inválido');const encoded=Buffer.from(result).toString(format==='base64url'?'base64':'hex');return format==='base64url'?encoded.replaceAll('+','-').replaceAll('/','_').replace(/=+$/,''):encoded}}}
export function createHash(algorithm:string){if(algorithm!=='sha256')throw new Error('Algoritmo inválido');return digestor()}
export function createHmac(algorithm:string,key:string){if(algorithm!=='sha256')throw new Error('Algoritmo inválido');return digestor(key)}
export function timingSafeEqual(a:Uint8Array,b:Uint8Array){if(a.length!==b.length)throw new Error('Tamanhos diferentes');let difference=0;for(let i=0;i<a.length;i++)difference|=a[i]^b[i];return difference===0}

import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash as nativeHash,createHmac as nativeHmac} from 'node:crypto';
import {createHash,createHmac,timingSafeEqual} from './crypto.bundle.mjs';
test('Worker SHA256 matches original billing event hashes',()=>{const value='cakto:{"id":"test","status":"paid"}';assert.equal(createHash('sha256').update(value).digest('hex'),nativeHash('sha256').update(value).digest('hex'))});
test('Worker HMAC preserves webhook and OAuth signatures',()=>{for(const format of ['hex','base64url'])assert.equal(createHmac('sha256','test-secret').update('ação=validar').digest(format),nativeHmac('sha256','test-secret').update('ação=validar').digest(format))});
test('Signature comparison rejects modified data',()=>{assert.equal(timingSafeEqual(new Uint8Array([1,2]),new Uint8Array([1,2])),true);assert.equal(timingSafeEqual(new Uint8Array([1,2]),new Uint8Array([1,3])),false);assert.throws(()=>timingSafeEqual(new Uint8Array([1]),new Uint8Array([1,2])))});

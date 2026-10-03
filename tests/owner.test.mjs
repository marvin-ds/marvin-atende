import test from 'node:test';import assert from 'node:assert/strict';import {ownerEligible}from'./owner.bundle.mjs';
const env={BLINK_PROJECT_ID:'copy',OWNER_PROJECT_ID:'copy',OWNER_EMAIL:'owner@example.invalid'};
const auth={userId:'u1',email:'owner@example.invalid'};
const sql={sql:async()=>({rows:[{email:'owner@example.invalid',email_verified:1}]})};
test('verified configured owner can initialize own copy',async()=>assert.equal(await ownerEligible(auth,env,sql),true));
test('inherited owner configuration cannot claim another project',async()=>assert.equal(await ownerEligible(auth,{...env,OWNER_PROJECT_ID:'original'},sql),false));
test('unverified email cannot claim ownership',async()=>assert.equal(await ownerEligible(auth,env,{sql:async()=>({rows:[{email:auth.email,email_verified:0}]})}),false));
test('another signed-in email cannot claim ownership',async()=>assert.equal(await ownerEligible({...auth,email:'other@example.invalid'},env,sql),false));
test('email must match both verified identity and auth database',async()=>assert.equal(await ownerEligible(auth,env,{sql:async()=>({rows:[{email:'other@example.invalid',email_verified:1}]})}),false));

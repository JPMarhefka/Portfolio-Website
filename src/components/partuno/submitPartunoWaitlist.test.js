import assert from "node:assert/strict";
import test from "node:test";
import {
  PARTUNO_FORMSPREE_ENDPOINT,
  submitPartunoWaitlist,
} from "./submitPartunoWaitlist.ts";

test("posts a trimmed email to the Partuno Formspree endpoint", async () => {
  let requestUrl = "";
  let requestInit;

  await submitPartunoWaitlist("  jp@example.com  ", async (url, init) => {
    requestUrl = url;
    requestInit = init;
    return new Response(null, { status: 200 });
  });

  assert.equal(requestUrl, PARTUNO_FORMSPREE_ENDPOINT);
  assert.equal(requestInit?.method, "POST");
  assert.equal(requestInit?.headers?.Accept, "application/json");
  assert.equal(
    requestInit?.body?.toString(),
    "email=jp%40example.com&_subject=New+Partuno+early-access+signup",
  );
});

test("rejects a blank email before making a request", async () => {
  let requestCount = 0;

  await assert.rejects(
    submitPartunoWaitlist("   ", async () => {
      requestCount += 1;
      return new Response(null, { status: 200 });
    }),
    /valid email/i,
  );

  assert.equal(requestCount, 0);
});

test("rejects when Formspree returns an unsuccessful response", async () => {
  await assert.rejects(
    submitPartunoWaitlist("jp@example.com", async () =>
      new Response(null, { status: 422 }),
    ),
    /unable to join/i,
  );
});

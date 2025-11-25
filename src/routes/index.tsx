import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        I'm aliyss. If this helped you feel free to check out my other stuff. ^^
        <br />
        Happy deploying.
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome back",
  meta: [
    {
      name: "description",
      content: "Qwik + Appwrite",
    },
  ],
};

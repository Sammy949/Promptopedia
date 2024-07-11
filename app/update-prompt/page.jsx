"use client";

import { Suspense, useState } from "react";
import Loading from "@components/loading";
import PromptFormWrapper from "@components/PromptFormWrapper";
import { useRouter } from "next/navigation";

const EditPrompt = () => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  const updatePrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!promptId) return alert("Prompt ID not found");

    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <PromptFormWrapper
        setPost={setPost}
        setSubmitting={setSubmitting}
        updatePrompt={updatePrompt}
      />
    </Suspense>
  );
};

export default EditPrompt;

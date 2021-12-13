import { createRef } from "react";

export function useFocus() {
  const htmlElRef = createRef();

  function setFocus() {
    htmlElRef.current.focus();
  }

  return [htmlElRef, setFocus];
}

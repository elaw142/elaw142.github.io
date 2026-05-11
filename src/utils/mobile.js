const MOBILE_QUERY = "(max-width: 768px)";

export function createMobileState(onChange) {
  const media = window.matchMedia(MOBILE_QUERY);
  let isMobile = media.matches;

  const handleChange = () => {
    const next = media.matches;
    if (next === isMobile) return;
    isMobile = next;
    onChange(isMobile);
  };

  media.addEventListener("change", handleChange);

  return {
    get value() {
      return isMobile;
    },
    dispose() {
      media.removeEventListener("change", handleChange);
    },
  };
}

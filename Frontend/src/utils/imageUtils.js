export function optimizeCloudinaryUrl(url, width = 800) {
  if (!url) return url;
  try {
    const marker = "/upload/";
    const idx = url.indexOf(marker);
    if (idx === -1) return url;
    const before = url.substring(0, idx + marker.length);
    const after = url.substring(idx + marker.length);
    // Request a resized image with quality auto and crop fill
    const transform = `w_${width},c_fill,q_auto,f_auto/`;
    return before + transform + after;
  } catch (e) {
    return url;
  }
}

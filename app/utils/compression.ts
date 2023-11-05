import LzString from "lz-string";

export function objToCompressedUrlSlug<O>(obj: O) {
  const result = LzString.compressToEncodedURIComponent(JSON.stringify(obj));

  return result;
}

export function parseCompressedUrlSlug<O = any>(slug: string): O {
  const result: O = JSON.parse(
    LzString.decompressFromEncodedURIComponent(slug) ?? "{}",
  );

  return result;
}

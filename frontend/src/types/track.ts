import type { Metadata } from "./metadata";
import type { Release } from "./release";

export interface Track {
  id: number;
  metadata: Metadata;
  release?: Release
}
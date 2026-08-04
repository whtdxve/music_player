import type { Track } from "./track";

export type TrackSourceType = 'RELEASE' | 'PLAYLIST';

export interface TrackSource {
    type: TrackSourceType;
    name: string;
    id: number;
    tracks: Track[];
}
import type { Artist } from "./artists";
import type { Track } from "./track";

export interface Release {
    id: number;
    title: string;
    cover?: string;
    artist?: Artist;
    tracks?: Track[];
}
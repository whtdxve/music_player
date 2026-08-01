export interface Metadata {
    id: number;
    fileName: string;
    filePath: string;
    fileUpdatedAt: string;
    fileSize: number;
    trackNo: number;
    coverData?: string;
    coverType?: string;
    title?: string;
    artist?: string;
    albumArtist?: string;
    releaseTitle?: string;
    releasedAt?: string;
    comment?: string;
    genre?: string;
    composer?: string;
    diskNumber?: string;
    duration: string;
}
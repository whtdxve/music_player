export type ContentSourceType = 'RELEASE' | 'PLAYLIST' | 'ARTIST'

export type ContentSource = {
    type: ContentSourceType,
    id: number
}
import { useApp } from "../../context/AppContext";
import ArtistView from "./views/ArtistView";
import ReleaseView from "./views/ReleaseView";

function MainContent() {
    const { contentSource } = useApp();

    if (!contentSource) {
        return <p>Выберите что-нибудь</p>
    }

    switch (contentSource.type) {
        case 'RELEASE':
            return <ReleaseView releaseId={contentSource.id} />;
        // case 'PLAYLIST':
        //     return <PlaylistView playlistId={selection.id} />;
        case 'ARTIST':
            return <ArtistView artistId={contentSource.id} />;
    }
}

export default MainContent;
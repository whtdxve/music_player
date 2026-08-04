import { useApp } from "../../context/AppContext";
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
        // case 'ARTIST':
        //     return <ArtistView artistId={selection.id} />;
    }
}

export default MainContent;
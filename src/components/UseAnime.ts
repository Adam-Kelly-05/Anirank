'use client'

import { Anime } from "@/types/Anime";
import * as React from "react"

export function getSpecificAnime(animeId: number) {
    const [anime, setAnime] = React.useState<Anime>();

    React.useEffect(() => {
        async function fetchUser() {
                const response = await fetch(`https://p7gfovbtqg.execute-api.eu-west-1.amazonaws.com/prod/anime/${animeId}`);
                if (!response.ok) {
                    setAnime(undefined);
                    return;
                }
                const raw = await response.json();
                const data = raw?.data ?? raw;
                setAnime(data || undefined);
        }
        fetchUser();
    }, [animeId]);

    return anime;
}

import { ActorCardItem } from "@/types/ActorCardItem";

export interface CharacterCardItem {
  characterId: number;
  animeId: number;
  name_english?: string;
  name_japanese?: string;
  image: string;
  voice_actors?: ActorCardItem[];
}

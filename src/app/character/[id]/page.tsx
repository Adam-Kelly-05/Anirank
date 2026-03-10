import Image from "next/image";
import characters from "../../../../public/characters.json";
import CharacterCarousel from "@/components/anime/CharacterCarousel";
import { notFound } from "next/navigation";


export const dynamicParams = false;

export async function generateStaticParams() {
  return characters.map((c) => ({ id: c.characterId.toString() }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const character = characters.find((c) => c.characterId.toString() === id);
  if (!character) notFound();

  const relatedCharacters = characters.filter(
    (c) => c.animeId === character.animeId && c.characterId !== character.characterId,
  );

  const voiceActors = character.voice_actors ?? [];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full max-w-xs rounded-xl overflow-hidden shadow-2xl bg-black/40">
          <Image
            src={character.image}
            alt={character.name_english}
            width={320}
            height={480}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold">{character.name_english}</h1>

          {character.name_japanese && (
            <h2 className="text-xl text-gray-400">{character.name_japanese}</h2>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-900">
            {character.birthdate && (
              <span className="rounded-full bg-blue-200 px-3 py-1 text-blue-900">
                Birthdate: {character.birthdate}
              </span>
            )}

            {character.zodiac_sign && (
              <span className="rounded-full bg-amber-200 px-3 py-1 text-amber-900">
                Zodiac: {character.zodiac_sign}
              </span>
            )}

            {character.age && (
              <span className="rounded-full bg-emerald-200 px-3 py-1 text-emerald-900">
                Age: {character.age}
              </span>
            )}
            {character.likes && (
              <span className="rounded-full bg-pink-200 px-3 py-1 text-pink-900">
                Likes: {character.likes}
              </span>
            )}

            {character.dislikes && (
              <span className="rounded-full bg-red-200 px-3 py-1 text-red-900">
                Dislikes: {character.dislikes}
              </span>
            )}
          </div>

          {character.occupation && (
            <div className="text-sm text-gray-200 flex flex-wrap gap-2">
              <span className="font-semibold text-gray-100 mr-1">Occupation:</span>

              {character.occupation
                .split(",")
                .map((job) => job.trim())
                .map((job) => (
                  <span
                    key={job}
                    className="rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-100"
                  >
                    {job}
                  </span>
                ))}
            </div>
          )}

          <p className="text-gray-100 leading-relaxed">{character.bio}</p>
        </div>
      </div>



      {relatedCharacters.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Explore More Characters</h2>
          <CharacterCarousel items={relatedCharacters} />
        </section>
      )}
    </div>
  );
}

import Image from "next/image";
import actors from "../../../../public/actors.json";
import { notFound } from "next/navigation";
import RoleCarousel from "@/components/anime/RoleCarousel";

export const dynamicParams = false;

export async function generateStaticParams() {
  return actors.map((a) => ({ id: a.actorId.toString() }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const actor = actors.find((a) => a.actorId.toString() === id);
  if (!actor) notFound();

  const roles = actor.other_roles ?? [];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Actor Image */}
        <div className="w-full max-w-xs rounded-xl overflow-hidden shadow-2xl bg-black/40">
          <Image
            src={actor.actor_image}
            alt={actor.name}
            width={320}
            height={480}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Actor Info */}
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold">{actor.name}</h1>

          {actor.birthday && (
            <span className="rounded-full bg-blue-200 px-3 py-1 text-blue-900 text-xs font-semibold">
              Birthday: {actor.birthday}
            </span>
          )}
          <div className="flex flex-wrap gap-4">
            <p className="text-gray-100 leading-relaxed">{actor.info}</p>
          </div>
        </div>
      </div>

    {/* Other Roles */}
      {roles.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Other Roles</h2>
          <RoleCarousel items={roles} />
        </section>
      )}
    </div>
  );
}

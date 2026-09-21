import { MUSIC_ARTIST, TRACKS } from "@/lib/playlist";

export function MusicCredits() {
  return (
    <div className="space-y-2 text-xs leading-relaxed">
      <p>
        Music by <a className="underline underline-offset-2 hover:text-foreground" href={MUSIC_ARTIST.url}>{MUSIC_ARTIST.name}</a>
        {" · "}<a className="hover:text-foreground" href={MUSIC_ARTIST.albumUrl}>{MUSIC_ARTIST.album}</a>
      </p>
      <details>
        <summary className="w-fit cursor-pointer hover:text-foreground">Track credits &amp; licenses</summary>
        <ul className="mt-3 space-y-1.5">
          {TRACKS.map((track) => (
            <li key={track.src}>
              <a className="underline underline-offset-2 hover:text-foreground" href={track.source}>{track.title}</a>
              {" — "}{track.artist}{" · "}
              <a className="underline underline-offset-2 hover:text-foreground" href={track.licenseUrl}>{track.license}</a>
            </li>
          ))}
        </ul>
        <a className="mt-3 inline-block underline underline-offset-2 hover:text-foreground" href="/audio/LICENSE.txt">Full music credits</a>
      </details>
    </div>
  );
}

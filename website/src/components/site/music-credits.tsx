import { MUSIC_ARTIST, TRACKS } from "@/lib/playlist";
import { RADIO_STATIONS, SOUND_CREDITS } from "./reference-data";

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
      <details>
        <summary className="w-fit cursor-pointer hover:text-foreground">Object sounds &amp; world radio</summary>
        <ul className="mt-3 space-y-1.5">
          {SOUND_CREDITS.map(sound => <li key={sound.url}>
            <a className="underline underline-offset-2" href={sound.url}>{sound.name}</a>{" — "}{sound.author}{" · "}<a className="underline underline-offset-2" href={sound.licenseUrl}>{sound.license}</a>{" · excerpted, looped, and processed"}
          </li>)}
          {RADIO_STATIONS.map(station => <li key={station.url}><a className="underline underline-offset-2" href={station.homepage}>{station.name}</a>{" · "}{station.place}{" · live stream"}</li>)}
        </ul>
        <p className="mt-3">The world dial uses curated station positions, not local AM/FM frequencies. Sound effects illustrate each control; they are not exact hardware models.</p>
      </details>
    </div>
  );
}

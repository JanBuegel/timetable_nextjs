export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-4 text-center">
      <h1 className="text-3xl font-bold">Open Flair Timetable</h1>
      <p className="max-w-prose">
        Installiere diese Seite als App, um den Timetable auch offline nutzen zu
        k&ouml;nnen. Auf iOS w&auml;hle dazu im Teilen-Men&uuml; <em>Zum Home-Bildschirm
        hinzuf&uuml;gen</em>. Auf Android oder Desktop kannst du die Install-Option
        deines Browsers verwenden.
      </p>
      <a
        href="/timetable"
        className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
      >
        Zum Timetable
      </a>
    </main>
  );
}

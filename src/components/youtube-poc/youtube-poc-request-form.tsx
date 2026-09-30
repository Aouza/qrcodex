"use client";

import { useState } from "react";

type YouTubePocResult = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string | null;
};

type SearchState = "idle" | "waiting" | "loading" | "success" | "error";
type SubmitState = "idle" | "loading" | "added" | "already-added" | "error";

export function YouTubePocRequestForm({ slug }: { slug: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubePocResult[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const trimmedQuery = query.trim();
  const canSearch = trimmedQuery.length >= 3 && searchState !== "loading";

  async function submitSearch() {
    if (!canSearch) {
      setSearchState(trimmedQuery.length === 0 ? "idle" : "waiting");
      return;
    }

    setSearchState("loading");
    setSubmitState("idle");
    setResults([]);
    setSelectedVideoId(null);

    try {
      const response = await fetch(`/api/youtube/poc/search?q=${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) throw new Error("Search failed.");

      const payload = (await response.json()) as { results?: YouTubePocResult[] };
      setResults(payload.results ?? []);
      setSearchState("success");
    } catch {
      setResults([]);
      setSearchState("error");
    }
  }

  async function submitRequest() {
    if (!selectedResult || submitState === "loading") return;

    setSubmitState("loading");
    try {
      const response = await fetch("/api/youtube/poc/queue/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          request: {
            videoId: selectedResult.videoId,
            title: selectedResult.title,
            channelTitle: selectedResult.channelTitle,
            thumbnailUrl: selectedResult.thumbnailUrl,
          },
        }),
      });

      if (!response.ok) throw new Error("Request failed.");

      setSubmitState("added");
    } catch {
      setSubmitState("error");
    }
  }

  const selectedResult = results.find((result) => result.videoId === selectedVideoId);

  return (
    <section className="youtube-poc__panel" aria-labelledby="youtube-poc-form-title">
      <div className="youtube-poc__form-heading">
        <p>POC YouTube</p>
        <h2 id="youtube-poc-form-title">Que som voce quer ouvir?</h2>
      </div>

      <label className="youtube-poc__search-label" htmlFor="youtube-poc-search">
        Buscar musica ou artista
      </label>
      <input
        id="youtube-poc-search"
        className="youtube-poc__search-input"
        value={query}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setResults([]);
          setSelectedVideoId(null);
          setSubmitState("idle");
          setSearchState(nextQuery.trim().length === 0 ? "idle" : nextQuery.trim().length < 3 ? "waiting" : "idle");
        }}
        placeholder="Ex: Deftones Change"
        autoComplete="off"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void submitSearch();
          }
        }}
      />
      <button
        type="button"
        className="youtube-poc__search-button"
        disabled={!canSearch}
        onClick={submitSearch}
      >
        {searchState === "loading" ? "Buscando..." : "Buscar"}
      </button>
      {searchState === "waiting" && <p className="youtube-poc__hint">Digite pelo menos 3 caracteres.</p>}
      {searchState === "loading" && <p className="youtube-poc__hint">Buscando musicas...</p>}
      {searchState === "error" && <p className="youtube-poc__error">Nao foi possivel buscar musicas. Tente novamente.</p>}

      {results.length > 0 && (
        <ol className="youtube-poc__results" aria-label="Resultados do YouTube">
          {results.map((result) => (
            <li key={result.videoId}>
              <button
                type="button"
                className={`youtube-poc__result${selectedVideoId === result.videoId ? " youtube-poc__result--selected" : ""}`}
                onClick={() => {
                  setSelectedVideoId(result.videoId);
                  setSubmitState("idle");
                }}
              >
                {result.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.thumbnailUrl} alt="" loading="lazy" />
                ) : (
                  <span className="youtube-poc__thumbnail-placeholder" aria-hidden="true" />
                )}
                <span>
                  <strong>{result.title}</strong>
                  <span>{result.channelTitle}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {searchState === "success" && results.length === 0 && query.trim().length >= 3 && (
        <p className="youtube-poc__hint">Nenhum video encontrado.</p>
      )}

      <button
        type="button"
        className="youtube-poc__submit"
        disabled={!selectedResult || submitState === "loading"}
        onClick={submitRequest}
      >
        {submitState === "loading" ? "Enviando..." : "Pedir musica"}
      </button>

      {submitState === "added" && (
        <div className="youtube-poc__success" role="status">
          <strong>Pedido enviado</strong>
          <span>Musica adicionada a fila.</span>
        </div>
      )}
      {submitState === "error" && (
        <div className="youtube-poc__error youtube-poc__submit-error" role="alert">
          Nao foi possivel adicionar a musica. Tente novamente.
        </div>
      )}
    </section>
  );
}

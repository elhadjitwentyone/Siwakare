const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Lit un fichier du repo via l'API GitHub authentifiée plutôt que
// raw.githubusercontent.com : cette dernière n'expose que les repos publics,
// donc tout basculement du repo en privé casserait silencieusement la
// lecture du contenu/des commandes. L'API authentifiée fonctionne dans les
// deux cas, avec la même permission "Contents" déjà accordée au token.
export async function fetchGithubFile(path: string): Promise<string | null> {
  if (!GITHUB_REPO) return null;
  try {
    if (GITHUB_TOKEN) {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.raw+json",
        },
        cache: "no-store",
      });
      return res.ok ? await res.text() : null;
    }
    // Repli sans token (dev local) : ne marche que si le repo est public.
    const res = await fetch(`https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`, {
      cache: "no-store",
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

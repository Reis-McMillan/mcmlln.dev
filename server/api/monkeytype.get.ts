const BASE = "https://api.monkeytype.com";

interface RankResponse {
  rank: number;
  wpm: number;
  acc: number;
  raw: number;
  consistency: number;
  timestamp: number;
}

interface StatsResponse {
  completedTests: number;
  startedTests: number;
  timeTyping: number;
}

async function mtFetch<T>(path: string, apeKey: string): Promise<T | null> {
  try {
    const res = await $fetch<{ data: T }>(`${BASE}${path}`, {
      headers: { Authorization: `ApeKey ${apeKey}` },
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export default cachedEventHandler(
  async (event) => {
    const { monkeytypeApeKey } = useRuntimeConfig(event);
    if (!monkeytypeApeKey) {
      throw createError({
        statusCode: 500,
        statusMessage: "Missing APE_KEY",
      });
    }

    const [rank15, rank60, stats] = await Promise.all([
      mtFetch<RankResponse>(
        "/leaderboards/rank?language=english&mode=time&mode2=15",
        monkeytypeApeKey
      ),
      mtFetch<RankResponse>(
        "/leaderboards/rank?language=english&mode=time&mode2=60",
        monkeytypeApeKey
      ),
      mtFetch<StatsResponse>("/users/stats", monkeytypeApeKey),
    ]);

    return { rank15, rank60, stats };
  },
  { maxAge: 600, name: "monkeytype-stats" }
);

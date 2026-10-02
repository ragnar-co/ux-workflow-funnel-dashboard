export function getNpsCategory(score) {
  if (score >= 9) return "promoter";
  if (score >= 7) return "passive";
  return "detractor";
}

export function getNpsScore(responses) {
  const total = responses.length || 1;
  const promoters = responses.filter((item) => getNpsCategory(item.score) === "promoter").length;
  const detractors = responses.filter((item) => getNpsCategory(item.score) === "detractor").length;
  return Math.round(((promoters - detractors) / total) * 100);
}

export function summarizeResponses(responses) {
  const total = responses.length;
  const promoters = responses.filter((item) => getNpsCategory(item.score) === "promoter").length;
  const passives = responses.filter((item) => getNpsCategory(item.score) === "passive").length;
  const detractors = responses.filter((item) => getNpsCategory(item.score) === "detractor").length;

  return {
    total,
    nps: getNpsScore(responses),
    promoters,
    passives,
    detractors,
    promoterRate: Math.round((promoters / (total || 1)) * 100),
    passiveRate: Math.round((passives / (total || 1)) * 100),
    detractorRate: Math.round((detractors / (total || 1)) * 100)
  };
}

export function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "Unassigned";
    acc[value] = acc[value] || [];
    acc[value].push(item);
    return acc;
  }, {});
}

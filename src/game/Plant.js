export default class Plant {
  constructor(definition, plantedAt) {
    this.definition = definition;
    this.plantedAt = plantedAt;
    this.growthTime = definition.growTime;
    this.waterBonus = 0; // percentage reduction in grow time from watering
  }

  water(level = 1) {
    // Each water action reduces remaining time by 10% per upgrade level
    this.waterBonus += 0.1 * level;
    if (this.waterBonus > 0.5) this.waterBonus = 0.5; // cap at 50%
  }

  isGrown(currentTime) {
    const elapsed = currentTime - this.plantedAt;
    const effectiveTime = this.growthTime * (1 - this.waterBonus);
    return elapsed >= effectiveTime;
  }
}
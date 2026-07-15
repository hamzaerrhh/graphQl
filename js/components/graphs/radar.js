import { generateRadarSVG } from "../../utils/radar.js";

/**
 * Builds a single radar "card" element.
 * @param {string} title - Card heading (e.g. "Core Proficiencies")
 * @param {object} data - Formatted radar data for this card
 * @param {object} options - { polyColor, strokeColor }
 * @returns {HTMLElement}
 */
export const radarCompo = (title, data, options) => {
  const card = document.createElement("div");
  card.className = "card radar-card";

  card.innerHTML = `
    <div class="card-title">${title}</div>
    <div class="radar-svg-holder">
      ${generateRadarSVG(data, options)}
    </div>
  `;

  return card;
};
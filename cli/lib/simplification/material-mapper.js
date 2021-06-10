import path from "path";
import { ColorUtils } from "@gltf-transform/core";
import { getAverageColor } from "fast-average-color-node";

/**
 * Map basic characteristics of material to new material.
 *
 * @param {*} baseMaterial
 * @param {*} material
 */
const mapMaterial = async (baseMaterial, material, basePath) => {
  // obtain basic color
  let textureType = "baseColor";
  let colorTexture = baseMaterial.getBaseColorTexture();

  // if no base color texture is defined, try emissive texture instead
  if (!colorTexture) {
    textureType = "emissive";
    colorTexture = baseMaterial.getEmissiveTexture();
  }

  // define default color
  let color = baseMaterial.getBaseColorFactor();
  if (colorTexture) {
    const textureFileName = colorTexture.getURI();
    const texturePath = path.join(basePath, textureFileName);
    const averageColor = await getAverageColor(texturePath);
    // converts string to number representation
    const colorAsNumber = parseInt(averageColor.hex.substr(1), 16);
    const factor = ColorUtils.hexToFactor(colorAsNumber, []);

    color = [...factor, averageColor.value[3] / 255];
  } else {
    textureType = "baseColor";
  }

  if (textureType === "emissive") {
    const [r, g, b] = color;
    material.setEmissiveFactor([r, g, b]);
    material.setBaseColorFactor(baseMaterial.getBaseColorFactor());
  } else {
    material.setBaseColorFactor(color);
  }

  material.setMetallicFactor(baseMaterial.getMetallicFactor());
  material.setRoughnessFactor(baseMaterial.getRoughnessFactor());
  material.setDoubleSided(baseMaterial.getDoubleSided());
};

export default mapMaterial;

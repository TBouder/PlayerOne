/******************************************************************************
**	@Author:				Thomas Bouder <Tbouder>
**	@Email:					Tbouder@protonmail.com
**	@Date:					Thursday February 18th 2021
**	@Filename:				gradientStep.js
******************************************************************************/

export function HSLColor(hue, sat, light) {
	this.hue = hue;
	this.saturation = sat;
	this.lightness = light;
	this.getCSS = function() {
		return "hsl("+this.hue+","+this.saturation+"%,"+this.lightness+"%)";
	}
}

function linearInterpolateColor(startColor, endColor, percentage) {
	const hueDiff = (endColor.hue - startColor.hue) * percentage;
	const satDiff = (endColor.saturation - startColor.saturation) * percentage;
	const lightDiff = (endColor.lightness - startColor.lightness) * percentage;
	return new HSLColor(startColor.hue + hueDiff, startColor.saturation + satDiff, startColor.lightness + lightDiff);
}

function getInterpolationArray(startColor, endColor, steps) {
	const interpolArray = [];
	for(let i = 0; i < steps; i++) {
		interpolArray.push(linearInterpolateColor(startColor, endColor, i/(steps-1)));
	}
	return interpolArray;
}

export function generateSteps(startColor, endColor, steps) {
	const interpolArray = getInterpolationArray(startColor, endColor, steps)
	return interpolArray.map(color => color.getCSS());
  
}



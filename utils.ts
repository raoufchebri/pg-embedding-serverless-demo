export function createHistogramData(data: number[], binWidth: number, minValue: number, maxValue: number, isExecTime: boolean = false) {
    let bins: number[] = [];
    let labels: string[] = [];
    const maxBinIndex = (maxValue - minValue) / binWidth;

    for (let i = 0; i <= maxBinIndex; i++) {
        labels.push(`${(minValue + binWidth * i).toFixed(2)} - ${(minValue + binWidth * (i + 1)).toFixed(2)}`);
        bins.push(0);
    }

    // Add special bin for execTime > 1000ms
    if (isExecTime) {
        labels.push('>1000');
        bins.push(0);
    }

    for (let value of data) {
        if (value > maxValue && isExecTime) {
            bins[bins.length - 1]++;
        } else {
            const binIndex = Math.floor((value - minValue) / binWidth);
            if (binIndex >= 0 && binIndex < bins.length) {
                bins[binIndex]++;
            }
        }
    }

    return { bins, labels };
}
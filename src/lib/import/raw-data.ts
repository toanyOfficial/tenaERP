export type ImportRawData<TParsed, TRaw> = {
  parsedData: TParsed;
  rawData: TRaw;
};

export function bindRawData<TParsed, TRaw>(parsedData: TParsed, rawData: TRaw): ImportRawData<TParsed, TRaw> {
  return { parsedData, rawData };
}

export function createRawDataJson<TRaw>(rawData: TRaw): string {
  return JSON.stringify(rawData);
}

export function restoreRawData<TRaw>(rawDataJson: string): TRaw {
  return JSON.parse(rawDataJson) as TRaw;
}

export function toRawDataJsonValue<TRaw>(rawData: TRaw) {
  return rawData as unknown as Record<string, unknown>;
}
